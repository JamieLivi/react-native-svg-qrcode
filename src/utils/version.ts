import * as ECCode from './errorCorrectionCode';
import * as ECLevel from './errorCorrectionLevel';
import { ALPHANUMERIC, BYTE, KANJI, MIXED, NUMERIC, getCharCountIndicator } from './mode';
import type { ErrorCorrectionLevel, IMode, Segment } from './types';
import { getBCHDigit, getSymbolTotalCodewords, isValidVersion } from './utils';

// Generator polynomial used to encode version information
const G18 =
  (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);

const G18_BCH = getBCHDigit(G18);

const getBestVersionForDataLength = (
  mode: IMode,
  length: number,
  errorCorrectionLevel: ErrorCorrectionLevel,
): number | undefined => {
  for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
    if (length <= getCapacity(currentVersion, errorCorrectionLevel, mode)) {
      return currentVersion;
    }
  }

  return undefined;
};

const getReservedBitsCount = (mode: IMode, version: number): number => {
  // Character count indicator + mode indicator bits
  return getCharCountIndicator(mode, version) + 4;
};

const getTotalBitsFromDataArray = (segments: Segment[], version: number): number => {
  let totalBits = 0;

  segments.forEach((data) => {
    const reservedBits = getReservedBitsCount(data.mode, version);
    totalBits += reservedBits + data.getBitsLength();
  });

  return totalBits;
};

const getBestVersionForMixedData = (
  segments: any[],
  errorCorrectionLevel: ErrorCorrectionLevel,
): number | undefined => {
  for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
    const length = getTotalBitsFromDataArray(segments, currentVersion);
    if (length <= getCapacity(currentVersion, errorCorrectionLevel, MIXED)) {
      return currentVersion;
    }
  }

  return undefined;
};

/**
 * Returns version number from a value.
 * If value is not a valid version, returns defaultValue
 *
 * @param  {number | string} value        QR Code version
 * @param  {number}          defaultValue Fallback value
 * @return {number}                       QR Code version number
 */
export const from = (value: number | string, defaultValue = 0): number => {
  if (isValidVersion(Number(value))) {
    return parseInt(value.toString(), 10);
  }

  return defaultValue;
};

/**
 * Returns how much data can be stored with the specified QR code version
 * and error correction level
 *
 * @param  {number} version              QR Code version (1-40)
 * @param  {number} errorCorrectionLevel Error correction level
 * @param  {string} mode                 Data mode
 * @return {number}                      Quantity of storable data
 */
export const getCapacity = (
  version: number,
  errorCorrectionLevel: ErrorCorrectionLevel,
  mode: IMode,
): number => {
  if (!isValidVersion(version)) {
    throw new Error('Invalid QR Code version');
  }

  // Use Byte mode as default
  if (typeof mode === 'undefined') {
    mode = BYTE;
  }

  // Total codewords for this QR code version (Data + Error correction)
  const totalCodewords = getSymbolTotalCodewords(version);

  // Total number of error correction codewords
  const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);

  // Total number of data codewords
  const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;

  if (mode === MIXED) {
    return dataTotalCodewordsBits;
  }

  const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);

  // Return max number of storable codewords
  switch (mode) {
    case NUMERIC:
      return Math.floor((usableBits / 10) * 3);

    case ALPHANUMERIC:
      return Math.floor((usableBits / 11) * 2);

    case KANJI:
      return Math.floor(usableBits / 13);

    case BYTE:
    default:
      return Math.floor(usableBits / 8);
  }
};

/**
 * Returns the minimum version needed to contain the amount of data
 *
 * @param  {any} data                    Segment of data
 * @param  {number} [errorCorrectionLevel=H] Error correction level
 * @param  {string} mode                 Data mode
 * @return {number}                      QR Code version
 */
export const getBestVersionForData = (
  data: any,
  errorCorrectionLevel: string | ErrorCorrectionLevel,
): number | undefined => {
  let seg;

  const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);

  if (Array.isArray(data)) {
    if (data.length > 1) {
      return getBestVersionForMixedData(data, ecl);
    }

    if (data.length === 0) {
      return 1;
    }

    seg = data[0];
  } else {
    seg = data;
  }

  return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
};

/**
 * Returns version information with relative error correction bits
 *
 * The version information is included in QR Code symbols of version 7 or larger.
 * It consists of an 18-bit sequence containing 6 data bits,
 * with 12 error correction bits calculated using the (18, 6) Golay code.
 *
 * @param  {number} version QR Code version
 * @return {number}         Encoded version info bits
 */
export const getEncodedBits = (version: number): number => {
  if (!isValidVersion(version) || version < 7) {
    throw new Error('Invalid QR Code version');
  }

  let d = version << 12;

  while (getBCHDigit(d) - G18_BCH >= 0) {
    d ^= G18 << (getBCHDigit(d) - G18_BCH);
  }

  return (version << 12) | d;
};
