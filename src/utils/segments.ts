import AlphanumericData from './alphanumeric-data';
import ByteData from './byte-data';
import Dijkstra from './dijkstra';
import KanjiData from './kanji-data';
import * as Mode from './mode';
import NumericData from './numeric-data';
import * as Regex from './regex';
import type { FormattedSegment, Graph, GraphTable, IMode } from './types';
import * as Utils from './utils';

const dijkstra = new Dijkstra();

/**
 * Returns UTF8 byte length
 */
const getStringByteLength = (str: string) => {
  return encodeURIComponent(str).length;
};

/**
 * Get a list of segments of the specified mode
 * from a string
 */
const getSegments = (regex: RegExp, mode: IMode, str: string) => {
  const segments = [];
  let result: RegExpExecArray | null;

  while ((result = regex.exec(str)) !== null) {
    segments.push({
      data: result[0],
      index: result.index,
      mode: mode,
      length: result[0].length,
    });
  }

  return segments;
};

/**
 * Extracts a series of segments with the appropriate
 * modes from a string
 */
const getSegmentsFromString = (dataStr: string): FormattedSegment[] => {
  const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
  const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
  let byteSegs = [];
  let kanjiSegs: any[];

  if (Utils.isKanjiModeEnabled()) {
    byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
    kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
  } else {
    byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
    kanjiSegs = [];
  }

  const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);

  return segs
    .sort((s1, s2) => s1.index - s2.index)
    .map((obj, index) => ({
      data: obj.data,
      mode: obj.mode,
      length: obj.length,
      index: index,
    }));
};

/**
 * Returns how many bits are needed to encode a string of
 * specified length with the specified mode
 */
const getSegmentBitsLength = (length: number, mode: IMode): number => {
  switch (mode) {
    case Mode.NUMERIC:
      return NumericData.getBitsLength(length);
    case Mode.ALPHANUMERIC:
      return AlphanumericData.getBitsLength(length);
    case Mode.KANJI:
      return KanjiData.getBitsLength(length);
    case Mode.BYTE:
      return ByteData.getBitsLength(length);
    default:
      throw new Error(`Unknown mode: ${JSON.stringify(mode)}`);
  }
};

/**
 * Merges adjacent segments which have the same mode
 */
const mergeSegments = (segs: FormattedSegment[]) => {
  return segs.reduce<FormattedSegment[]>((acc, curr) => {
    const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
    if (prevSeg && prevSeg.mode === curr.mode) {
      prevSeg.data += curr.data;
      return acc;
    }

    acc.push(curr);
    return acc;
  }, []);
};

/**
 * Generates a list of all possible nodes combination which
 * will be used to build a segments graph.
 *
 * Nodes are divided by groups. Each group will contain a list of all the modes
 * in which is possible to encode the given text.
 *
 * For example the text '12345' can be encoded as Numeric, Alphanumeric or Byte.
 * The group for '12345' will contain then 3 objects, one for each
 * possible encoding mode.
 *
 * Each node represents a possible segment.
 */

const buildNodes = (segs: FormattedSegment[]) => {
  const nodes = [];
  for (let i = 0; i < segs.length; i++) {
    const seg = segs[i];

    switch (seg.mode) {
      case Mode.NUMERIC:
        nodes.push([
          seg,
          { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
          { data: seg.data, mode: Mode.BYTE, length: seg.length },
        ]);
        break;
      case Mode.ALPHANUMERIC:
        nodes.push([seg, { data: seg.data, mode: Mode.BYTE, length: seg.length }]);
        break;
      case Mode.KANJI:
        nodes.push([
          seg,
          { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) },
        ]);
        break;
      case Mode.BYTE:
        nodes.push([{ data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }]);
        break;
    }
  }

  return nodes;
};

/**
 * Builds a graph from a list of nodes.
 * All segments in each node group will be connected with all the segments of
 * the next group and so on.
 *
 * At each connection will be assigned a weight depending on the
 * segment's byte length
 */
const buildGraph = (
  nodes: FormattedSegment[][],
  version: number,
): { map: Graph; table: GraphTable } => {
  const table: GraphTable = {};
  const graph: Graph = { start: {} };
  let prevNodeIds = ['start'];

  for (let i = 0; i < nodes.length; i++) {
    const nodeGroup = nodes[i];
    const currentNodeIds: string[] = [];

    for (let j = 0; j < nodeGroup.length; j++) {
      const node = nodeGroup[j];
      const key = '' + i + j;

      currentNodeIds.push(key);
      table[key] = { node: node, lastCount: 0 };
      graph[key] = {};

      for (let n = 0; n < prevNodeIds.length; n++) {
        const prevNodeId = prevNodeIds[n];

        if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
          graph[prevNodeId][key] =
            getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) -
            getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);

          table[prevNodeId].lastCount += node.length;
        } else {
          if (table[prevNodeId]) {
            table[prevNodeId].lastCount = node.length;
          }

          graph[prevNodeId][key] =
            getSegmentBitsLength(node.length, node.mode) +
            4 +
            Mode.getCharCountIndicator(node.mode, version); // switch cost
        }
      }
    }

    prevNodeIds = currentNodeIds;
  }

  for (let n = 0; n < prevNodeIds.length; n++) {
    graph[prevNodeIds[n]].end = 0;
  }

  return { map: graph, table: table };
};

/**
 * Builds a segment from a specified data and mode.
 * If a mode is not specified, the most suitable will be used.
 */
const buildSingleSegment = (data: string, modesHint: IMode | string) => {
  const bestMode = Mode.getBestModeForData(data);
  let mode = Mode.from(modesHint, bestMode);

  // Make sure data can be encoded
  if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
    throw new Error(
      `"${data}" cannot be encoded with mode ${Mode.toString(mode)}.\n Suggested mode is: ${Mode.toString(bestMode)}`,
    );
  }

  // Use Mode.BYTE if Kanji support is disabled
  if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
    mode = Mode.BYTE;
  }

  switch (mode) {
    case Mode.NUMERIC:
      return new NumericData(data);
    case Mode.ALPHANUMERIC:
      return new AlphanumericData(data);
    case Mode.KANJI:
      return new KanjiData(data);
    case Mode.BYTE:
    default:
      return new ByteData(data);
  }
};

/**
 * Builds a list of segments from an array.
 * Array can contain Strings or Objects with segment's info.
 * For each item which is a string, will be generated a segment with the given
 * string and the more appropriate encoding mode.
 * For each item which is an object, will be generated a segment with the given
 * data and mode.
 * Objects must contain at least the property "data".
 * If property "mode" is not present, the more suitable mode will be used.
 */
export const fromArray = (
  array: Array<string | { data: string; mode?: IMode }>,
): Array<NumericData | AlphanumericData | ByteData | KanjiData> => {
  return array.reduce<Array<NumericData | AlphanumericData | ByteData | KanjiData>>((acc, seg) => {
    if (typeof seg === 'string') {
      acc.push(buildSingleSegment(seg, Mode.getBestModeForData(seg)));
    } else if (seg.data) {
      acc.push(buildSingleSegment(seg.data, seg.mode || Mode.getBestModeForData(seg.data)));
    }
    return acc;
  }, []);
};

/**
 * Builds an optimized sequence of segments from a string,
 * which will produce the shortest possible bitstream.
 */
export const fromString = (data: string, version: number) => {
  const segs = getSegmentsFromString(data);

  const nodes = buildNodes(segs);
  const graph = buildGraph(nodes, version);
  const path = dijkstra.findPath(graph.map, 'start', 'end');

  const optimizedSegs: FormattedSegment[] = [];
  for (let i = 1; i < path.length - 1; i++) {
    optimizedSegs.push(graph.table[path[i]].node);
  }

  return fromArray(mergeSegments(optimizedSegs));
};

/**
 * Splits a string in various segments with the modes which
 * best represent their content.
 * The produced segments are far from being optimized.
 * The output of this function is only used to estimate a QR Code version
 * which may contain the data.
 */
export const rawSplit = (
  data: string,
): Array<NumericData | AlphanumericData | ByteData | KanjiData> => {
  return fromArray(getSegmentsFromString(data));
};
