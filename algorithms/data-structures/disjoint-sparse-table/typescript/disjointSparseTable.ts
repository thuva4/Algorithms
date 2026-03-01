class DisjointSparseTableDS {
  private readonly table: number[][];
  private readonly values: number[];
  private readonly size: number;
  private readonly levels: number;

  constructor(arr: number[]) {
    const n = arr.length;
    this.size = Math.max(1, 1 << Math.ceil(Math.log2(Math.max(1, n))));
    this.levels = Math.max(1, Math.ceil(Math.log2(this.size)));
    this.values = new Array(this.size).fill(0);

    for (let i = 0; i < n; i += 1) {
      this.values[i] = arr[i];
    }

    this.table = Array.from({ length: this.levels }, () => new Array(this.size).fill(0));
    this.build();
  }

  private build(): void {
    for (let level = 0; level < this.levels; level += 1) {
      const block = 1 << (level + 1);
      const half = block >> 1;

      for (let start = 0; start < this.size; start += block) {
        const mid = start + half;
        const end = Math.min(start + block, this.size);

        if (mid >= end) {
          continue;
        }

        this.table[level][mid] = this.values[mid];
        for (let i = mid + 1; i < end; i += 1) {
          this.table[level][i] = this.table[level][i - 1] + this.values[i];
        }

        this.table[level][mid - 1] = this.values[mid - 1];
        for (let i = mid - 2; i >= start; i -= 1) {
          this.table[level][i] = this.table[level][i + 1] + this.values[i];
        }
      }
    }
  }

  query(left: number, right: number): number {
    if (left === right) {
      return this.values[left];
    }

    const level = 31 - Math.clz32(left ^ right);
    return this.table[level][left] + this.table[level][right];
  }
}

export function disjointSparseTable(
  n: number,
  array: number[],
  queries: Array<[number, number]>,
): number[] {
  const values = array.slice(0, n);
  const dst = new DisjointSparseTableDS(values);
  return queries.map(([left, right]) => dst.query(left, right));
}
