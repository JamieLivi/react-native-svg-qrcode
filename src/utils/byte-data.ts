import BitBuffer from './bit-buffer';
import { BYTE } from './mode';
import type { IMode } from './types';

const stringToUtf8Uint8Array = (str: string): Uint8Array => {
  const utf8 = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
    String.fromCharCode(parseInt(p1, 16)),
  );
  const arr = new Uint8Array(utf8.length);
  for (let i = 0; i < utf8.length; i++) {
    arr[i] = utf8.charCodeAt(i);
  }
  return arr;
};

class ByteData {
  mode: IMode;
  data: Uint8Array;

  constructor(data: string | Uint8Array) {
    this.mode = BYTE;
    if (typeof data === 'string') {
      this.data = stringToUtf8Uint8Array(data);
    } else {
      this.data = new Uint8Array(data);
    }
  }

  static getBitsLength(length: number): number {
    return length * 8;
  }

  getLength(): number {
    return this.data.length;
  }

  getBitsLength(): number {
    return ByteData.getBitsLength(this.data.length);
  }

  write(bitBuffer: BitBuffer): void {
    for (let i = 0, l = this.data.length; i < l; i++) {
      bitBuffer.put(this.data[i], 8);
    }
  }
}

export default ByteData;
