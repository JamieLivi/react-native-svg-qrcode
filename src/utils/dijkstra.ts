/* eslint-disable @typescript-eslint/unbound-method */
import type { Graph, Predecessors, PriorityQueue, PriorityQueueItem } from './types';

class Dijkstra {
  singleSourceShortestPaths(graph: Graph, s: string, d?: string): Predecessors {
    const predecessors: Predecessors = {};
    const costs: { [node: string]: number } = {};
    costs[s] = 0;

    const open = this.priorityQueue.make();
    open.push(s, 0);

    while (!open.empty()) {
      const closest = open.pop();
      if (!closest) {
        break;
      }

      const u = closest.value;
      const costOfSToU = closest.cost;
      const adjacentNodes = graph[u] || {};

      for (const v in adjacentNodes) {
        if (Object.prototype.hasOwnProperty.call(adjacentNodes, v)) {
          const costOfE = adjacentNodes[v];
          const costOfSToUPlusCostOfE = costOfSToU + costOfE;
          const costOfSToV = costs[v];
          const firstVisit = typeof costs[v] === 'undefined';

          if (firstVisit || costOfSToV > costOfSToUPlusCostOfE) {
            costs[v] = costOfSToUPlusCostOfE;
            open.push(v, costOfSToUPlusCostOfE);
            predecessors[v] = u;
          }
        }
      }
    }

    if (typeof d !== 'undefined' && typeof costs[d] === 'undefined') {
      throw new Error(`Could not find a path from ${s} to ${d}.`);
    }

    return predecessors;
  }

  extractShortestPathFromPredecessorList(predecessors: Predecessors, d: string): string[] {
    const nodes: string[] = [];
    let u: string | undefined = d;
    while (u) {
      nodes.push(u);
      u = predecessors[u];
    }
    nodes.reverse();
    return nodes;
  }

  findPath(graph: Graph, s: string, d: string): string[] {
    const predecessors = this.singleSourceShortestPaths(graph, s, d);
    return this.extractShortestPathFromPredecessorList(predecessors, d);
  }

  priorityQueue = {
    make: (opts?: {
      sorter?: (a: PriorityQueueItem, b: PriorityQueueItem) => number;
    }): PriorityQueue => {
      const sorter = opts?.sorter || this.priorityQueue.defaultSorter;
      return {
        queue: [],
        sorter,
        push: this.priorityQueue.push,
        pop: this.priorityQueue.pop,
        empty: this.priorityQueue.empty,
      };
    },

    defaultSorter: (a: PriorityQueueItem, b: PriorityQueueItem): number => a.cost - b.cost,

    push(this: PriorityQueue, value: string, cost: number): void {
      const item = { value, cost };
      this.queue.push(item);
      this.queue.sort(this.sorter);
    },

    pop(this: PriorityQueue): PriorityQueueItem | undefined {
      return this.queue.shift();
    },

    empty(this: PriorityQueue): boolean {
      return this.queue.length === 0;
    },
  };
}

export default Dijkstra;
