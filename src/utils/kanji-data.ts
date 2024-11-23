import BitBuffer from './bit-buffer';
import * as Mode from './mode';
import type { IMode } from './types';
import * as Utils from './utils';

class KanjiData {
  mode: IMode;
  data: string;

  constructor(data: string) {
    this.mode = Mode.KANJI;
    this.data = data;
  }

  static getBitsLength(length: number): number {
    return length * 13;
  }

  getLength(): number {
    return this.data.length;
  }

  getBitsLength(): number {
    return KanjiData.getBitsLength(this.data.length);
  }

  write(bitBuffer: BitBuffer): void {
    for (let i = 0; i < this.data.length; i++) {
      let value = parseInt(Utils.toSJIS(this.data[i]), 16);

      // For characters with Shift JIS values from 0x8140 to 0x9FFC:
      if (value >= 0x8140 && value <= 0x9ffc) {
        // Subtract 0x8140 from Shift JIS value
        value -= 0x8140;

        // For characters with Shift JIS values from 0xE040 to 0xEBBF
      } else if (value >= 0xe040 && value <= 0xebbf) {
        // Subtract 0xC140 from Shift JIS value
        value -= 0xc140;
      } else {
        throw new Error(
          'Invalid SJIS character: ' + this.data[i] + '\n' + 'Make sure your charset is UTF-8',
        );
      }

      // Multiply most significant byte of result by 0xC0
      // and add least significant byte to product
      value = (Math.floor(value / 256) % 256) * 192 + (value % 256);

      // Convert result to a 13-bit binary string
      bitBuffer.put(value, 13);
    }
  }
}

export default KanjiData;
