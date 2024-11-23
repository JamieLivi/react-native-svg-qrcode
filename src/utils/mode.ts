import * as Regex from './regex';
import type { IMode } from './types';
import { isValidVersion } from './utils';

export const NUMERIC: IMode = {
  id: 'Numeric',
  bit: 1 << 0,
  ccBits: [10, 12, 14],
};

export const ALPHANUMERIC: IMode = {
  id: 'Alphanumeric',
  bit: 1 << 1,
  ccBits: [9, 11, 13],
};

export const BYTE: IMode = {
  id: 'Byte',
  bit: 1 << 2,
  ccBits: [8, 16, 16],
};

export const KANJI: IMode = {
  id: 'Kanji',
  bit: 1 << 3,
  ccBits: [8, 10, 12],
};

export const MIXED: IMode = {
  bit: -1,
};

export const getCharCountIndicator = (mode: IMode, version: number): number => {
  if (!mode.ccBits) {
    throw new Error('Invalid mode: ' + JSON.stringify(mode));
  }

  if (!isValidVersion(version)) {
    throw new Error('Invalid version: ' + version);
  }

  if (version >= 1 && version < 10) {
    return mode.ccBits[0];
  } else if (version < 27) {
    return mode.ccBits[1];
  }
  return mode.ccBits[2];
};

export const getBestModeForData = (dataStr: string): IMode => {
  if (Regex.testNumeric(dataStr)) {
    return NUMERIC;
  } else if (Regex.testAlphanumeric(dataStr)) {
    return ALPHANUMERIC;
  } else if (Regex.testKanji(dataStr)) {
    return KANJI;
  } else {
    return BYTE;
  }
};

export const toString = (mode: IMode): string => {
  if (mode && mode.id) {
    return mode.id;
  }
  throw new Error('Invalid mode');
};

export const isValid = (mode: IMode): boolean => {
  return mode && mode.bit !== undefined && mode.ccBits !== undefined;
};

const fromString = (string: string): IMode => {
  if (typeof string !== 'string') {
    throw new Error('Param is not a string');
  }

  const lcStr = string.toLowerCase();

  switch (lcStr) {
    case 'numeric':
      return NUMERIC;
    case 'alphanumeric':
      return ALPHANUMERIC;
    case 'kanji':
      return KANJI;
    case 'byte':
      return BYTE;
    default:
      throw new Error('Unknown mode: ' + string);
  }
};

export const from = (value: IMode | string, defaultValue: IMode): IMode => {
  if (isValid(value as IMode)) {
    return value as IMode;
  }

  try {
    return fromString(value as string);
  } catch (e) {
    return defaultValue;
  }
};
