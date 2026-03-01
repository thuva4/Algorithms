class SparseTableDS {
  private readonly table: number[][];
  private readonly logs: number[];

  constructor(arr: number[]) {
    const n = arr.length;
    const levels = Math.max(1, Math.floor(Math.log2(Math.max(1, n))) + 1);

    this.table = Array.from({ length: levels }, () => new Array(n).fill(0));
    this.logs = new Array(n + 1).fill(0);

    for (let i = 2; i <= n; i += 1) {
      this.logs[i] = this.logs[i >> 1] + 1;
    }

    for (let i = 0; i < n; i += 1) {
      this.table[0][i] = arr[i];
    }

    for (let level = 1; level < levels; level += 1) {
      const width = 1 << level;
      const half = width >> 1;

      for (let i = 0; i + width <= n; i += 1) {
        this.table[level][i] = Math.min(this.table[level - 1][i], this.table[level - 1][i + half]);
      }
    }
  }

  query(left: number, right: number): number {
    const level = this.logs[right - left + 1];
    return Math.min(this.table[level][left], this.table[level][right - (1 << level) + 1]);
  }
}

export function sparseTable(
  n: number,
  array: number[],
  queries: Array<[number, number]>,
): number[] {
  const values = array.slice(0, n);
  const table = new SparseTableDS(values);
  return queries.map(([left, right]) => table.query(left, right));
}
