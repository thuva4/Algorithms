type FenwickQuery =
  | { type: 'sum'; index: number }
  | { type: 'update'; index: number; value: number };

class FenwickTree {
  private readonly tree: number[];
  private readonly values: number[];

  constructor(arr: number[]) {
    this.values = [...arr];
    this.tree = new Array(arr.length + 1).fill(0);

    for (let i = 0; i < arr.length; i += 1) {
      this.add(i, arr[i]);
    }
  }

  private add(index: number, delta: number): void {
    for (let i = index + 1; i < this.tree.length; i += i & -i) {
      this.tree[i] += delta;
    }
  }

  set(index: number, value: number): void {
    const delta = value - this.values[index];
    this.values[index] = value;
    this.add(index, delta);
  }

  query(index: number): number {
    let sum = 0;

    for (let i = index + 1; i > 0; i -= i & -i) {
      sum += this.tree[i];
    }

    return sum;
  }
}

export function fenwickTreeOperations(
  array: number[],
  queries: FenwickQuery[],
): number[] {
  const fenwick = new FenwickTree(array);
  const results: number[] = [];

  for (const query of queries) {
    if (query.type === 'update') {
      fenwick.set(query.index, query.value);
    } else {
      results.push(fenwick.query(query.index));
    }
  }

  return results;
}
