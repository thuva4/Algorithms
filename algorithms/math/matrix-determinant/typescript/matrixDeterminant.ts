export function matrixDeterminant(arr: number[]): number {
  let idx = 0;
  const n = arr[idx++];
  const mat: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) {
      row.push(arr[idx++]);
    }
    mat.push(row);
  }

  let det = 1.0;
  for (let col = 0; col < n; col++) {
    let maxRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(mat[row][col]) > Math.abs(mat[maxRow][col])) {
        maxRow = row;
      }
    }
    if (maxRow !== col) {
      [mat[col], mat[maxRow]] = [mat[maxRow], mat[col]];
      det *= -1;
    }
    if (mat[col][col] === 0) {
      return 0;
    }
    det *= mat[col][col];
    for (let row = col + 1; row < n; row++) {
      const factor = mat[row][col] / mat[col][col];
      for (let j = col + 1; j < n; j++) {
        mat[row][j] -= factor * mat[col][j];
      }
    }
  }
  return Math.round(det);
}

console.log(matrixDeterminant([2, 1, 2, 3, 4]));
console.log(matrixDeterminant([2, 1, 0, 0, 1]));
console.log(matrixDeterminant([3, 6, 1, 1, 4, -2, 5, 2, 8, 7]));
console.log(matrixDeterminant([1, 5]));
