class SegmentTreeLazyDS {
  private readonly tree: number[];
  private readonly lazy: number[];
  private readonly size: number;

  constructor(arr: number[]) {
    this.size = arr.length;
    this.tree = new Array(Math.max(1, 4 * this.size)).fill(0);
    this.lazy = new Array(Math.max(1, 4 * this.size)).fill(0);

    if (this.size > 0) {
      this.build(arr, 1, 0, this.size - 1);
    }
  }

  private build(arr: number[], node: number, start: number, end: number): void {
    if (start === end) {
      this.tree[node] = arr[start];
      return;
    }

    const mid = (start + end) >> 1;
    this.build(arr, node * 2, start, mid);
    this.build(arr, node * 2 + 1, mid + 1, end);
    this.tree[node] = this.tree[node * 2] + this.tree[node * 2 + 1];
  }

  private apply(node: number, start: number, end: number, value: number): void {
    this.tree[node] += value * (end - start + 1);
    this.lazy[node] += value;
  }

  private push(node: number, start: number, end: number): void {
    if (this.lazy[node] === 0 || start === end) {
      return;
    }

    const mid = (start + end) >> 1;
    this.apply(node * 2, start, mid, this.lazy[node]);
    this.apply(node * 2 + 1, mid + 1, end, this.lazy[node]);
    this.lazy[node] = 0;
  }

  update(left: number, right: number, value: number): void {
    if (this.size === 0) {
      return;
    }

    this.updateRange(1, 0, this.size - 1, left, right, value);
  }

  private updateRange(
    node: number,
    start: number,
    end: number,
    left: number,
    right: number,
    value: number,
  ): void {
    if (right < start || end < left) {
      return;
    }

    if (left <= start && end <= right) {
      this.apply(node, start, end, value);
      return;
    }

    this.push(node, start, end);
    const mid = (start + end) >> 1;
    this.updateRange(node * 2, start, mid, left, right, value);
    this.updateRange(node * 2 + 1, mid + 1, end, left, right, value);
    this.tree[node] = this.tree[node * 2] + this.tree[node * 2 + 1];
  }

  query(left: number, right: number): number {
    if (this.size === 0) {
      return 0;
    }

    return this.queryRange(1, 0, this.size - 1, left, right);
  }

  private queryRange(
    node: number,
    start: number,
    end: number,
    left: number,
    right: number,
  ): number {
    if (right < start || end < left) {
      return 0;
    }

    if (left <= start && end <= right) {
      return this.tree[node];
    }

    this.push(node, start, end);
    const mid = (start + end) >> 1;
    return (
      this.queryRange(node * 2, start, mid, left, right) +
      this.queryRange(node * 2 + 1, mid + 1, end, left, right)
    );
  }
}

export function segmentTreeLazy(
  n: number,
  array: number[],
  operations: Array<[number, number, number, number]>,
): number[] {
  const values = array.slice(0, n);
  const tree = new SegmentTreeLazyDS(values);
  const results: number[] = [];

  for (const [type, left, right, value] of operations) {
    if (type === 1) {
      tree.update(left, right, value);
    } else if (type === 2) {
      results.push(tree.query(left, right));
    }
  }

  return results;
}
