class SqrtDecompositionDS {
  private readonly values: number[];
  private readonly blocks: number[];
  private readonly blockSize: number;

  constructor(arr: number[]) {
    const n = arr.length;
    this.values = [...arr];
    this.blockSize = Math.max(1, Math.floor(Math.sqrt(Math.max(1, n))));
    this.blocks = new Array(Math.ceil(n / this.blockSize)).fill(0);

    for (let i = 0; i < n; i += 1) {
      this.blocks[Math.floor(i / this.blockSize)] += arr[i];
    }
  }

  query(left: number, right: number): number {
    let result = 0;
    const startBlock = Math.floor(left / this.blockSize);
    const endBlock = Math.floor(right / this.blockSize);

    if (startBlock === endBlock) {
      for (let i = left; i <= right; i += 1) {
        result += this.values[i];
      }
      return result;
    }

    for (let i = left; i < (startBlock + 1) * this.blockSize; i += 1) {
      result += this.values[i];
    }

    for (let block = startBlock + 1; block < endBlock; block += 1) {
      result += this.blocks[block];
    }

    for (let i = endBlock * this.blockSize; i <= right; i += 1) {
      result += this.values[i];
    }

    return result;
  }
}

export function sqrtDecomposition(
  n: number,
  array: number[],
  queries: Array<[number, number]>,
): number[] {
  const values = array.slice(0, n);
  const sqrt = new SqrtDecompositionDS(values);
  return queries.map(([left, right]) => sqrt.query(left, right));
}
