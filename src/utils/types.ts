import AlphanumericData from './alphanumeric-data';
import BitMatrix from './bit-matrix';
import ByteData from './byte-data';
import KanjiData from './kanji-data';
import NumericData from './numeric-data';

export interface ErrorCorrectionLevel {
  bit: number;
}

export interface IMode {
  id?: string;
  bit: number;
  ccBits?: number[];
}

export interface Graph {
  [node: string]: {
    [adjacentNode: string]: number;
  };
}

export interface Predecessors {
  [node: string]: string;
}

export interface PriorityQueueItem {
  value: string;
  cost: number;
}

export interface PriorityQueue {
  queue: PriorityQueueItem[];
  sorter: (a: PriorityQueueItem, b: PriorityQueueItem) => number;
  push: (value: string, cost: number) => void;
  pop: () => PriorityQueueItem | undefined;
  empty: () => boolean;
}

export interface GraphTable {
  [key: string]: {
    node: FormattedSegment;
    lastCount: number;
  };
}

export interface QRCodeOptions {
  version?: number;
  errorCorrectionLevel?: string;
  maskPattern?: number;
  toSJISFunc?: (data: string) => string;
}

export type Segment = NumericData | AlphanumericData | ByteData | KanjiData;

export type FormattedSegment = {
  data: string;
  mode: IMode;
  length: number;
  index?: number;
};

export interface QRCodeSymbol {
  modules: BitMatrix;
  version: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
  maskPattern: number;
  segments: Segment[];
}
