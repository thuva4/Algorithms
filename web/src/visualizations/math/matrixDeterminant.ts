import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  pivot: '#3b82f6',
  eliminating: '#ef4444',
  processed: '#22c55e',
  current: '#eab308',
};

export class MatrixDeterminantVisualization implements AlgorithmVisualization {
  name = 'Matrix Determinant';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Build a small matrix (3x3 or 4x4) from input data
    const size = data.length >= 16 ? 4 : 3;
    const matrix: number[][] = [];
    for (let i = 0; i < size; i++) {
      matrix.push([]);
      for (let j = 0; j < size; j++) {
        const idx = i * size + j;
        matrix[i].push(idx < data.length ? (data[idx] % 20) - 10 : (i === j ? 1 : 0));
      }
    }

    // Flatten matrix for display
    const flatMatrix = matrix.flat();

    this.steps.push({
      data: [...flatMatrix],
      highlights: flatMatrix.map((v, i) => ({
        index: i,
        color: '#94a3b8',
        label: `[${Math.floor(i / size)}][${i % size}]=${v}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Computing determinant of ${size}x${size} matrix using row reduction (Gaussian elimination)`,
    });

    // Gaussian elimination to upper triangular form
    const m = matrix.map((row) => [...row]);
    let det = 1;
    let sign = 1;

    for (let col = 0; col < size; col++) {
      // Find pivot
      let pivotRow = -1;
      for (let row = col; row < size; row++) {
        if (m[row][col] !== 0) {
          pivotRow = row;
          break;
        }
      }

      if (pivotRow === -1) {
        // Determinant is 0
        this.steps.push({
          data: m.flat(),
          highlights: [{ index: col * size + col, color: COLORS.eliminating, label: 'Zero column!' }],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Column ${col}: no non-zero pivot found. Determinant = 0`,
        });
        det = 0;
        break;
      }

      // Swap rows if needed
      if (pivotRow !== col) {
        [m[col], m[pivotRow]] = [m[pivotRow], m[col]];
        sign *= -1;

        this.steps.push({
          data: m.flat(),
          highlights: [
            ...m[col].map((_, j) => ({ index: col * size + j, color: COLORS.pivot, label: `${m[col][j]}` })),
          ],
          comparisons: [],
          swaps: [[col * size, pivotRow * size]],
          sorted: [],
          stepDescription: `Swap row ${pivotRow} with row ${col} (sign flips to ${sign > 0 ? '+' : '-'})`,
        });
      }

      const pivotVal = m[col][col];
      det *= pivotVal;

      this.steps.push({
        data: m.flat(),
        highlights: [{ index: col * size + col, color: COLORS.pivot, label: `pivot=${pivotVal}` }],
        comparisons: [],
        swaps: [],
        sorted: Array.from({ length: col }, (_, i) => i * size + i),
        stepDescription: `Column ${col}: pivot = ${pivotVal}. Running det = ${det * sign}`,
      });

      // Eliminate below pivot
      for (let row = col + 1; row < size; row++) {
        if (m[row][col] === 0) continue;
        const factor = m[row][col] / pivotVal;

        for (let j = col; j < size; j++) {
          m[row][j] -= factor * m[col][j];
          m[row][j] = Math.round(m[row][j] * 1000) / 1000; // avoid floating point noise
        }

        this.steps.push({
          data: m.flat(),
          highlights: [
            { index: row * size + col, color: COLORS.eliminating, label: `0` },
            ...m[row].map((v, j) => ({
              index: row * size + j,
              color: COLORS.current,
              label: `${Math.round(v * 100) / 100}`,
            })),
          ],
          comparisons: [],
          swaps: [],
          sorted: Array.from({ length: col + 1 }, (_, i) => i * size + i),
          stepDescription: `R${row} = R${row} - (${Math.round(factor * 100) / 100}) * R${col}. Eliminated m[${row}][${col}]`,
        });
      }
    }

    const finalDet = det !== 0 ? Math.round(det * sign * 100) / 100 : 0;

    // Show final upper triangular matrix
    this.steps.push({
      data: m.flat(),
      highlights: Array.from({ length: size }, (_, i) => ({
        index: i * size + i,
        color: COLORS.processed,
        label: `${Math.round(m[i][i] * 100) / 100}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: size }, (_, i) => i * size + i),
      stepDescription: `Determinant = ${sign > 0 ? '' : '-'}product of diagonal = ${finalDet}`,
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
