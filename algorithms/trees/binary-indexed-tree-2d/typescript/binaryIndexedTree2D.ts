class BIT2D {
  private readonly tree: number[][];
  private readonly rows: number;
  private readonly cols: number;

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.tree = Array.from({ length: rows + 1 }, () => new Array(cols + 1).fill(0));
  }

  update(row: number, col: number, delta: number): void {
    for (let r = row + 1; r <= this.rows; r += r & -r) {
      for (let c = col + 1; c <= this.cols; c += c & -c) {
        this.tree[r][c] += delta;
      }
    }
  }

  query(row: number, col: number): number {
    let sum = 0;

    for (let r = row + 1; r > 0; r -= r & -r) {
      for (let c = col + 1; c > 0; c -= c & -c) {
        sum += this.tree[r][c];
      }
    }

    return sum;
  }
}

export function binaryIndexedTree2D(
  rows: number,
  cols: number,
  matrix: number[][],
  operations: number[][],
): number[] {
  const bit = new BIT2D(rows, cols);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const value = matrix[row]?.[col] ?? 0;
      if (value !== 0) {
        bit.update(row, col, value);
      }
    }
  }

  const results: number[] = [];

  for (const [type, row, col, value] of operations) {
    if (type === 1) {
      bit.update(row, col, value);
    } else if (type === 2) {
      results.push(bit.query(row, col));
    }
  }

  return results;
}
