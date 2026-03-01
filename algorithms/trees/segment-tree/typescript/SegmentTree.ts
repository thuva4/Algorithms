type SegmentTreeQuery =
  | { type: 'sum'; left: number; right: number }
  | { type: 'update'; index: number; value: number };

class SegmentTree {
  private readonly tree: number[];
  private readonly size: number;

  constructor(arr: number[]) {
    this.size = arr.length;
    this.tree = new Array(Math.max(1, 4 * this.size)).fill(0);

    if (this.size > 0) {
      this.build(arr, 0, 0, this.size - 1);
    }
  }

  private build(arr: number[], node: number, start: number, end: number): void {
    if (start === end) {
      this.tree[node] = arr[start];
      return;
    }

    const mid = Math.floor((start + end) / 2);
    this.build(arr, node * 2 + 1, start, mid);
    this.build(arr, node * 2 + 2, mid + 1, end);
    this.tree[node] = this.tree[node * 2 + 1] + this.tree[node * 2 + 2];
  }

  update(index: number, value: number): void {
    if (this.size === 0) {
      return;
    }

    this.updateRange(0, 0, this.size - 1, index, value);
  }

  private updateRange(
    node: number,
    start: number,
    end: number,
    index: number,
    value: number,
  ): void {
    if (start === end) {
      this.tree[node] = value;
      return;
    }

    const mid = Math.floor((start + end) / 2);
    if (index <= mid) {
      this.updateRange(node * 2 + 1, start, mid, index, value);
    } else {
      this.updateRange(node * 2 + 2, mid + 1, end, index, value);
    }

    this.tree[node] = this.tree[node * 2 + 1] + this.tree[node * 2 + 2];
  }

  query(left: number, right: number): number {
    if (this.size === 0) {
      return 0;
    }

    return this.queryRange(0, 0, this.size - 1, left, right);
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

    const mid = Math.floor((start + end) / 2);
    return (
      this.queryRange(node * 2 + 1, start, mid, left, right) +
      this.queryRange(node * 2 + 2, mid + 1, end, left, right)
    );
  }
}

export function segmentTreeOperations(
  array: number[],
  queries: SegmentTreeQuery[],
): number[] {
  const segmentTree = new SegmentTree(array);
  const results: number[] = [];

  for (const query of queries) {
    if (query.type === 'update') {
      segmentTree.update(query.index, query.value);
    } else {
      results.push(segmentTree.query(query.left, query.right));
    }
  }

  return results;
}
