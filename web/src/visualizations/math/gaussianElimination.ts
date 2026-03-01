import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  pivot: '#ef4444',
  row: '#3b82f6',
  eliminating: '#eab308',
  zeroed: '#9ca3af',
  solved: '#22c55e',
  result: '#a855f7',
};

export class GaussianEliminationVisualization implements AlgorithmVisualization {
  name = 'Gaussian Elimination';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Create a 3x3 augmented matrix [A | b] from data
    // Flatten matrix: rows are stored sequentially, 4 values per row (3 coefficients + 1 RHS)
    const n = 3;
    const matrix: number[][] = [];

    for (let i = 0; i < n; i++) {
      matrix[i] = [];
      for (let j = 0; j <= n; j++) {
        const idx = i * (n + 1) + j;
        matrix[i][j] = idx < data.length ? (data[idx] % 20) : (i === j ? (i + 2) : (i + j + 1));
      }
    }

    // Ensure the system is solvable: make diagonal dominant if needed
    for (let i = 0; i < n; i++) {
      let rowSum = 0;
      for (let j = 0; j < n; j++) {
        if (j !== i) rowSum += Math.abs(matrix[i][j]);
      }
      if (Math.abs(matrix[i][i]) <= rowSum) {
        matrix[i][i] = rowSum + i + 2;
      }
    }

    // Flatten matrix for data array
    const flattenMatrix = (m: number[][]): number[] => {
      const flat: number[] = [];
      for (let i = 0; i < n; i++) {
        for (let j = 0; j <= n; j++) {
          flat.push(parseFloat(m[i][j].toFixed(4)));
        }
      }
      return flat;
    };

    this.steps.push({
      data: flattenMatrix(matrix),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Gaussian elimination on 3x3 system. Matrix: [${matrix.map(r => '[' + r.map(v => v.toFixed(1)).join(', ') + ']').join(', ')}]`,
    });

    // Forward elimination
    for (let col = 0; col < n; col++) {
      // Find pivot (partial pivoting)
      let maxRow = col;
      let maxVal = Math.abs(matrix[col][col]);
      for (let row = col + 1; row < n; row++) {
        if (Math.abs(matrix[row][col]) > maxVal) {
          maxVal = Math.abs(matrix[row][col]);
          maxRow = row;
        }
      }

      // Swap rows if needed
      if (maxRow !== col) {
        const temp = matrix[col];
        matrix[col] = matrix[maxRow];
        matrix[maxRow] = temp;

        this.steps.push({
          data: flattenMatrix(matrix),
          highlights: [
            { index: col * (n + 1), color: COLORS.pivot, label: `Row ${col}` },
            { index: maxRow * (n + 1), color: COLORS.pivot, label: `Row ${maxRow}` },
          ],
          comparisons: [],
          swaps: [[col * (n + 1), maxRow * (n + 1)]],
          sorted: [],
          stepDescription: `Partial pivoting: swap row ${col} and row ${maxRow} (pivot = ${matrix[col][col].toFixed(2)})`,
        });
      }

      // Show pivot element
      const pivotIdx = col * (n + 1) + col;
      this.steps.push({
        data: flattenMatrix(matrix),
        highlights: [
          { index: pivotIdx, color: COLORS.pivot, label: `pivot=${matrix[col][col].toFixed(2)}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Column ${col}: pivot element = ${matrix[col][col].toFixed(4)} at position (${col},${col})`,
      });

      // Eliminate below pivot
      for (let row = col + 1; row < n; row++) {
        const factor = matrix[row][col] / matrix[col][col];

        this.steps.push({
          data: flattenMatrix(matrix),
          highlights: [
            { index: pivotIdx, color: COLORS.pivot, label: `pivot` },
            { index: row * (n + 1) + col, color: COLORS.eliminating, label: `factor=${factor.toFixed(2)}` },
          ],
          comparisons: [[pivotIdx, row * (n + 1) + col]],
          swaps: [],
          sorted: [],
          stepDescription: `Eliminate: R${row} = R${row} - (${factor.toFixed(4)}) * R${col}`,
        });

        for (let j = col; j <= n; j++) {
          matrix[row][j] -= factor * matrix[col][j];
        }

        this.steps.push({
          data: flattenMatrix(matrix),
          highlights: Array.from({ length: n + 1 }, (_, j) => ({
            index: row * (n + 1) + j,
            color: COLORS.row,
            label: `${matrix[row][j].toFixed(2)}`,
          })),
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Row ${row} after elimination: [${matrix[row].map(v => v.toFixed(2)).join(', ')}]`,
        });
      }
    }

    // Show upper triangular form
    this.steps.push({
      data: flattenMatrix(matrix),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Upper triangular form achieved. Now back-substitute.`,
    });

    // Back substitution
    const solution: number[] = new Array(n).fill(0);

    for (let i = n - 1; i >= 0; i--) {
      let sum = matrix[i][n]; // RHS
      for (let j = i + 1; j < n; j++) {
        sum -= matrix[i][j] * solution[j];
      }
      solution[i] = sum / matrix[i][i];

      this.steps.push({
        data: flattenMatrix(matrix),
        highlights: [
          { index: i * (n + 1) + i, color: COLORS.solved, label: `x${i}=${solution[i].toFixed(3)}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: Array.from({ length: n - i }, (_, k) => (i + k) * (n + 1) + (i + k)),
        stepDescription: `Back-sub: x${i} = (${matrix[i][n].toFixed(2)} - ${i < n - 1 ? 'sum of known terms' : '0'}) / ${matrix[i][i].toFixed(2)} = ${solution[i].toFixed(4)}`,
      });
    }

    // Final solution
    this.steps.push({
      data: solution.map(v => parseFloat(v.toFixed(4))),
      highlights: solution.map((v, i) => ({
        index: i,
        color: COLORS.result,
        label: `x${i}=${v.toFixed(3)}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: n }, (_, i) => i),
      stepDescription: `Solution: ${solution.map((v, i) => `x${i} = ${v.toFixed(4)}`).join(', ')}`,
    });

    return this.steps[0];
  }

  step(): VisualizationState | null {
    this.currentStepIndex++;
    if (this.currentStepIndex >= this.steps.length) {
      this.currentStepIndex = this.steps.length;
      return null;
    }
    return this.steps[this.currentStepIndex];
  }

  reset(): void {
    this.currentStepIndex = -1;
  }

  getStepCount(): number {
    return this.steps.length;
  }

  getCurrentStep(): number {
    return this.currentStepIndex;
  }
}
