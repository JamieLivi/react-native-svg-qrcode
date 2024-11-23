import { getSymbolSize } from './utils';

/**
 * Calculate the row/column coordinates of the center module of each alignment pattern
 * for the specified QR Code version.
 * The alignment patterns are positioned symmetrically on either side of the diagonal
 * running from the top left corner of the symbol to the bottom right corner.
 * Since positions are symmetrical only half of the coordinates are returned.
 * Each item of the array will represent in turn the x and y coordinate.
 */
export const getRowColCoords = (version: number): number[] => {
  if (version === 1) {
    return [];
  }

  const posCount = Math.floor(version / 7) + 2;
  const size = getSymbolSize(version);
  const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
  const positions = [size - 7]; // Last coord is always (size - 7)

  for (let i = 1; i < posCount - 1; i++) {
    positions[i] = positions[i - 1] - intervals;
  }

  positions.push(6); // First coord is always 6

  return positions.reverse();
};

/**
 * Returns an array containing the positions of each alignment pattern.
 * Each array's element represents the center point of the pattern as (x, y) coordinates
 * Coordinates are calculated expanding the row/column coordinates returned by {@link getRowColCoords}
 * and filtering out the items that overlap with finder patterns
 */

export const getPositions = (version: number): Array<[number, number]> => {
  const coords: Array<[number, number]> = [];
  const pos = getRowColCoords(version);
  const posLength = pos.length;

  for (let i = 0; i < posLength; i++) {
    for (let j = 0; j < posLength; j++) {
      // Skip if position is occupied by finder patterns
      if (
        (i === 0 && j === 0) || // top-left
        (i === 0 && j === posLength - 1) || // bottom-left
        (i === posLength - 1 && j === 0) // top-right
      ) {
        continue;
      }

      coords.push([pos[i], pos[j]]);
    }
  }

  return coords;
};
