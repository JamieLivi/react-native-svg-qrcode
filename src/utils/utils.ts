let toSJISFunction: ((data: string) => string) | undefined;

const CODEWORDS_COUNT: number[] = [
  0, // Not used
  26,
  44,
  70,
  100,
  134,
  172,
  196,
  242,
  292,
  346,
  404,
  466,
  532,
  581,
  655,
  733,
  815,
  901,
  991,
  1085,
  1156,
  1258,
  1364,
  1474,
  1588,
  1706,
  1828,
  1921,
  2051,
  2185,
  2323,
  2465,
  2611,
  2761,
  2876,
  3034,
  3196,
  3362,
  3532,
  3706,
];

/**
 * Returns the QR Code size for the specified version
 *
 * @param  {number} version QR Code version
 * @return {number}         size of QR code
 */
export const getSymbolSize = (version: number): number => {
  if (!version) {
    throw new Error('"version" cannot be null or undefined');
  }
  if (version < 1 || version > 40) {
    throw new Error('"version" should be in range from 1 to 40');
  }
  return version * 4 + 17;
};

/**
 * Returns the total number of codewords used to store data and EC information.
 */
export const getSymbolTotalCodewords = (version: number): number => {
  if (!version) {
    throw new Error('"version" cannot be null or undefined');
  }
  if (version < 1 || version > 40) {
    throw new Error('"version" should be in range from 1 to 40');
  }
  const codewords = CODEWORDS_COUNT[version];
  if (codewords === undefined) {
    throw new Error(`Invalid version: ${version}`);
  }
  return codewords;
};

/**
 * Encode data with Bose-Chaudhuri-Hocquenghem
 *
 * @param  {number} data Value to encode
 * @return {number}      Encoded value
 */
export const getBCHDigit = (data: number): number => {
  let digit = 0;

  while (data !== 0) {
    digit++;
    data >>>= 1;
  }

  return digit;
};

export const setToSJISFunction = (f: (data: string) => string): void => {
  if (typeof f !== 'function') {
    throw new Error('"toSJISFunc" is not a valid function.');
  }

  toSJISFunction = f;
};

export const isKanjiModeEnabled = (): boolean => {
  return typeof toSJISFunction !== 'undefined';
};

export const toSJIS = (kanji: string): string => {
  if (!toSJISFunction) {
    throw new Error('toSJISFunction is not defined');
  }
  return toSJISFunction(kanji);
};

/**
 * Check if QR Code version is valid
 */
export const isValidVersion = (version: number) => {
  return !isNaN(version) && version >= 1 && version <= 40;
};
