/**
 * Helper class to handle QR Code symbol modules
 */
class BitMatrix {
  size: number;
  data: Uint8Array;
  reservedBit: Uint8Array;

  constructor(size: number) {
    if (!size || size < 1) {
      throw new Error('BitMatrix size must be defined and greater than 0');
    }

    this.size = size;
    this.data = new Uint8Array(size * size);
    this.reservedBit = new Uint8Array(size * size);
  }

  /**
   * Set bit value at specified location
   * If reserved flag is set, this bit will be ignored during masking process
   */
  set(row: number, col: number, value: boolean, reserved?: boolean): void {
    const index = row * this.size + col;
    this.data[index] = value ? 1 : 0;
    if (reserved) {
      this.reservedBit[index] = 1;
    }
  }

  /**
   * Returns bit value at specified location
   */
  get(row: number, col: number): boolean {
    return this.data[row * this.size + col] === 1;
  }

  /**
   * Applies xor operator at specified location
   * (used during masking process)
   */
  xor(row: number, col: number, value: boolean): void {
    if (value) {
      this.data[row * this.size + col] = this.data[row * this.size + col] ? 0 : 1;
    }
  }

  /**
   * Check if bit at specified location is reserved
   */
  isReserved(row: number, col: number): boolean {
    return this.reservedBit[row * this.size + col] === 1;
  }
}

export default BitMatrix;
