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

  peek(): T | undefined {
    return this.heap[0];
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
  r: number;
  c: number;
  f: number;
  g: number;
}

export function aStarBidirectional(arr: number[]): number {
  if (arr.length < 7) return -1;

  const rows = arr[0];
  const cols = arr[1];
  const sr = arr[2], sc = arr[3];
  const er = arr[4], ec = arr[5];
  const numObs = arr[6];

  if (arr.length < 7 + 2 * numObs) return -1;

  if (sr < 0 || sr >= rows || sc < 0 || sc >= cols || er < 0 || er >= rows || ec < 0 || ec >= cols) return -1;
  if (sr === er && sc === ec) return 0;

  const grid: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
  for (let i = 0; i < numObs; i++) {
    const r = arr[7 + 2 * i];
    const c = arr[7 + 2 * i + 1];
    if (r >= 0 && r < rows && c >= 0 && c < cols) {
      grid[r][c] = true;
    }
  }

  if (grid[sr][sc] || grid[er][ec]) return -1;

  const openF = new MinHeap<Node>((a, b) => a.f - b.f);
  const openB = new MinHeap<Node>((a, b) => a.f - b.f);

  const gF: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Number.MAX_SAFE_INTEGER));
  const gB: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Number.MAX_SAFE_INTEGER));

  const hStart = Math.abs(sr - er) + Math.abs(sc - ec);
  gF[sr][sc] = 0;
  openF.push({ r: sr, c: sc, f: hStart, g: 0 });

  const hEnd = Math.abs(er - sr) + Math.abs(ec - sc);
  gB[er][ec] = 0;
  openB.push({ r: er, c: ec, f: hEnd, g: 0 });

  let bestPath = Number.MAX_SAFE_INTEGER;
  const dr = [-1, 1, 0, 0];
  const dc = [0, 0, -1, 1];

  while (!openF.isEmpty() && !openB.isEmpty()) {
    // Forward
    if (!openF.isEmpty()) {
      const u = openF.pop()!;
      if (u.g <= gF[u.r][u.c]) {
        for (let i = 0; i < 4; i++) {
          const nr = u.r + dr[i];
          const nc = u.c + dc[i];

          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !grid[nr][nc]) {
            const newG = u.g + 1;
            if (newG < gF[nr][nc]) {
              gF[nr][nc] = newG;
              const h = Math.abs(nr - er) + Math.abs(nc - ec);
              openF.push({ r: nr, c: nc, f: newG + h, g: newG });

              if (gB[nr][nc] !== Number.MAX_SAFE_INTEGER) {
                bestPath = Math.min(bestPath, newG + gB[nr][nc]);
              }
            }
          }
        }
      }
    }

    // Backward
    if (!openB.isEmpty()) {
      const u = openB.pop()!;
      if (u.g <= gB[u.r][u.c]) {
        for (let i = 0; i < 4; i++) {
          const nr = u.r + dr[i];
          const nc = u.c + dc[i];

          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !grid[nr][nc]) {
            const newG = u.g + 1;
            if (newG < gB[nr][nc]) {
              gB[nr][nc] = newG;
              const h = Math.abs(nr - sr) + Math.abs(nc - sc);
              openB.push({ r: nr, c: nc, f: newG + h, g: newG });

              if (gF[nr][nc] !== Number.MAX_SAFE_INTEGER) {
                bestPath = Math.min(bestPath, newG + gF[nr][nc]);
              }
            }
          }
        }
      }
    }

    const minF = openF.peek()?.f ?? Number.MAX_SAFE_INTEGER;
    const minB = openB.peek()?.f ?? Number.MAX_SAFE_INTEGER;

    if (bestPath !== Number.MAX_SAFE_INTEGER && minF + minB >= bestPath) break;
  }

  return bestPath === Number.MAX_SAFE_INTEGER ? -1 : bestPath;
}
