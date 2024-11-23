import { createQrCode } from './utils';

export const genMatrix = (
  value: string,
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H',
): number[][] => {
  const arr: number[] = Array.from(createQrCode(value, { errorCorrectionLevel }).modules.data);
  const sqrt = Math.sqrt(arr.length);
  return arr.reduce<number[][]>((rows, key, index) => {
    if (index % sqrt === 0) {
      rows.push([key]);
    } else {
      rows[rows.length - 1].push(key);
    }
    return rows;
  }, []);
};
