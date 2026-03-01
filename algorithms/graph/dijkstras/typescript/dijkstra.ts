class MinHeap<T> {
  private heap: T[];
  private compare: (a: T, b: T) => number;

  constructor(compare: (a: T, b: T) => number) {
    this.heap = [];
    this.compare = compare;
  }

  push(val: T): void {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): T | undefined {
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0 && end !== undefined) {
      this.heap[0] = end;
      this.sinkDown(0);
    }
    return min;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  private bubbleUp(idx: number): void {
    const element = this.heap[idx];
    while (idx > 0) {
      let parentIdx = Math.floor((idx - 1) / 2);
      let parent = this.heap[parentIdx];
      if (this.compare(element, parent) >= 0) break;
      this.heap[parentIdx] = element;
      this.heap[idx] = parent;
      idx = parentIdx;
    }
  }

  private sinkDown(idx: number): void {
    const length = this.heap.length;
    const element = this.heap[idx];

    while (true) {
      let leftChildIdx = 2 * idx + 1;
      let rightChildIdx = 2 * idx + 2;
      let leftChild, rightChild;
      let swap = null;

      if (leftChildIdx < length) {
        leftChild = this.heap[leftChildIdx];
        if (this.compare(leftChild, element) < 0) {
          swap = leftChildIdx;
        }
      }

      if (rightChildIdx < length) {
        rightChild = this.heap[rightChildIdx];
        if (
          (swap === null && this.compare(rightChild, element) < 0) ||
          (swap !== null && leftChild && this.compare(rightChild, leftChild) < 0)
        ) {
          swap = rightChildIdx;
        }
      }

      if (swap === null) break;
      this.heap[idx] = this.heap[swap];
      this.heap[swap] = element;
      idx = swap;
    }
  }
}

interface Edge {
  to: number;
  weight: number;
}

interface Node {
  u: number;
  d: number;
}

const INF = 1000000000;

export function dijkstra(arr: number[]): number[] {
  if (arr.length < 2) return [];

  const n = arr[0];
  const m = arr[1];

  if (arr.length < 2 + 3 * m + 1) return [];

  const start = arr[2 + 3 * m];
  if (start < 0 || start >= n) return [];

  const adj: Edge[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < m; i++) {
    const u = arr[2 + 3 * i];
    const v = arr[2 + 3 * i + 1];
    const w = arr[2 + 3 * i + 2];
    if (u >= 0 && u < n && v >= 0 && v < n) {
      adj[u].push({ to: v, weight: w });
    }
  }

  const dist: number[] = new Array(n).fill(INF);
  dist[start] = 0;

  const pq = new MinHeap<Node>((a, b) => a.d - b.d);
  pq.push({ u: start, d: 0 });

  while (!pq.isEmpty()) {
    const current = pq.pop();
    if (!current) break;
    const u = current.u;
    const d = current.d;

    if (d > dist[u]) continue;

    for (const e of adj[u]) {
      if (dist[u] + e.weight < dist[e.to]) {
        dist[e.to] = dist[u] + e.weight;
        pq.push({ u: e.to, d: dist[e.to] });
      }
    }
  }

  return dist;
}
