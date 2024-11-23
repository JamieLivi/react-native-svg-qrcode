import type { ErrorCorrectionLevel } from './types';

export const L: ErrorCorrectionLevel = { bit: 1 };
export const M: ErrorCorrectionLevel = { bit: 0 };
export const Q: ErrorCorrectionLevel = { bit: 3 };
export const H: ErrorCorrectionLevel = { bit: 2 };

export const fromString = (string: string): ErrorCorrectionLevel => {
  if (typeof string !== 'string') {
    throw new Error('Param is not a string');
  }

  const lcStr = string.toLowerCase();

  switch (lcStr) {
    case 'l':
    case 'low':
      return L;

    case 'm':
    case 'medium':
      return M;

    case 'q':
    case 'quartile':
      return Q;

    case 'h':
    case 'high':
      return H;

    default:
      throw new Error('Unknown EC Level: ' + string);
  }
};

export const isValid = (level: unknown): level is ErrorCorrectionLevel => {
  return (
    typeof level === 'object' &&
    level !== null &&
    'bit' in level &&
    typeof level.bit === 'number' &&
    level.bit >= 0 &&
    level.bit < 4
  );
};

export const from = (
  value?: string | ErrorCorrectionLevel,
  defaultValue: ErrorCorrectionLevel = L,
): ErrorCorrectionLevel => {
  if (value === undefined) {
    return defaultValue;
  }
  if (isValid(value)) {
    return value;
  }

  try {
    return fromString(value);
  } catch (e) {
    return defaultValue;
  }
};
