class MergeSortTreeDS {
  private readonly tree: number[][];
  private readonly size: number;

  constructor(arr: number[]) {
    this.size = arr.length;
    this.tree = Array.from({ length: Math.max(1, 4 * this.size) }, () => []);

    if (this.size > 0) {
      this.build(arr, 1, 0, this.size - 1);
    }
  }

  private build(arr: number[], node: number, start: number, end: number): void {
    if (start === end) {
      this.tree[node] = [arr[start]];
      return;
    }

    const mid = (start + end) >> 1;
    this.build(arr, node * 2, start, mid);
    this.build(arr, node * 2 + 1, mid + 1, end);
    this.tree[node] = this.mergeSorted(this.tree[node * 2], this.tree[node * 2 + 1]);
  }

  private mergeSorted(left: number[], right: number[]): number[] {
    const merged: number[] = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        merged.push(left[i]);
        i += 1;
      } else {
        merged.push(right[j]);
        j += 1;
      }
    }

    while (i < left.length) {
      merged.push(left[i]);
      i += 1;
    }

    while (j < right.length) {
      merged.push(right[j]);
      j += 1;
    }

    return merged;
  }

  private upperBound(arr: number[], value: number): number {
    let low = 0;
    let high = arr.length;

    while (low < high) {
      const mid = (low + high) >> 1;
      if (arr[mid] <= value) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }

    return low;
  }

  countLessThanOrEqual(left: number, right: number, value: number): number {
    if (this.size === 0) {
      return 0;
    }

    return this.query(1, 0, this.size - 1, left, right, value);
  }

  private query(
    node: number,
    start: number,
    end: number,
    left: number,
    right: number,
    value: number,
  ): number {
    if (right < start || end < left) {
      return 0;
    }

    if (left <= start && end <= right) {
      return this.upperBound(this.tree[node], value);
    }

    const mid = (start + end) >> 1;
    return (
      this.query(node * 2, start, mid, left, right, value) +
      this.query(node * 2 + 1, mid + 1, end, left, right, value)
    );
  }
}

export function mergeSortTree(
  n: number,
  array: number[],
  queries: Array<[number, number, number]>,
): number[] {
  const values = array.slice(0, n);
  const tree = new MergeSortTreeDS(values);
  return queries.map(([left, right, value]) => tree.countLessThanOrEqual(left, right, value));
}
