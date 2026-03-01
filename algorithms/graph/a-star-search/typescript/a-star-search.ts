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

interface Node {
  id: number;
  f: number;
  g: number;
}

interface Edge {
  to: number;
  weight: number;
}

export function aStarSearch(arr: number[]): number {
  if (arr.length < 2) return -1;

  const n = arr[0];
  const m = arr[1];

  if (arr.length < 2 + 3 * m + 2 + n) return -1;

  const start = arr[2 + 3 * m];
  const goal = arr[2 + 3 * m + 1];

  if (start < 0 || start >= n || goal < 0 || goal >= n) return -1;
  if (start === goal) return 0;

  const adj: Edge[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < m; i++) {
    const u = arr[2 + 3 * i];
    const v = arr[2 + 3 * i + 1];
    const w = arr[2 + 3 * i + 2];

    if (u >= 0 && u < n && v >= 0 && v < n) {
      adj[u].push({ to: v, weight: w });
    }
  }

  const hIndex = 2 + 3 * m + 2;
  
  const openSet = new MinHeap<Node>((a, b) => a.f - b.f);
  const gScore: number[] = new Array(n).fill(Number.MAX_SAFE_INTEGER);

  gScore[start] = 0;
  openSet.push({ id: start, f: arr[hIndex + start], g: 0 });

  while (!openSet.isEmpty()) {
    const current = openSet.pop();
    if (!current) break;
    const u = current.id;

    if (u === goal) return current.g;

    if (current.g > gScore[u]) continue;

    for (const e of adj[u]) {
      const v = e.to;
      const w = e.weight;

      if (gScore[u] !== Number.MAX_SAFE_INTEGER && gScore[u] + w < gScore[v]) {
        gScore[v] = gScore[u] + w;
        const f = gScore[v] + arr[hIndex + v];
        openSet.push({ id: v, f: f, g: gScore[v] });
      }
    }
  }

  return -1;
}
