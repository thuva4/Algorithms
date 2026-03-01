import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  computing: '#3b82f6',
  dependency: '#eab308',
  filled: '#22c55e',
  target: '#ef4444',
  result: '#a855f7',
};

export class CombinationVisualization implements AlgorithmVisualization {
  name = 'Combinations (Pascal\'s Triangle)';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = Math.min(Math.max(data[0] || 6, 2), 10);
    const k = Math.min(Math.max(data[1] || 2, 0), n);

    // Build Pascal's triangle using DP
    // C[i][j] = C[i-1][j-1] + C[i-1][j]
    const pascal: number[][] = [];

    // Flatten to 1D for visualization data
    // Row i has i+1 entries, total = sum_{i=0}^{n} (i+1) = (n+1)(n+2)/2
    const flatten = (): number[] => {
      const flat: number[] = [];
      for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= i; j++) {
          flat.push(pascal[i] ? (pascal[i][j] || 0) : 0);
        }
      }
      return flat;
    };

    const getIndex = (row: number, col: number): number => {
      return (row * (row + 1)) / 2 + col;
    };

    // Initialize empty triangle
    for (let i = 0; i <= n; i++) {
      pascal[i] = new Array(i + 1).fill(0);
    }

    this.steps.push({
      data: flatten(),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Building Pascal's triangle to compute C(${n}, ${k}). Triangle has ${n + 1} rows.`,
    });

    // Fill row by row
    for (let i = 0; i <= n; i++) {
      // Each row starts and ends with 1
      pascal[i][0] = 1;
      pascal[i][i] = 1;

      // Show the edges
      const edgeHighlights: { index: number; color: string; label?: string }[] = [
        { index: getIndex(i, 0), color: COLORS.filled, label: '1' },
      ];
      if (i > 0) {
        edgeHighlights.push({ index: getIndex(i, i), color: COLORS.filled, label: '1' });
      }

      this.steps.push({
        data: flatten(),
        highlights: edgeHighlights,
        comparisons: [],
        swaps: [],
        sorted: [getIndex(i, 0), getIndex(i, i)],
        stepDescription: `Row ${i}: set C(${i},0) = 1 and C(${i},${i}) = 1`,
      });

      // Fill interior values
      for (let j = 1; j < i; j++) {
        const above = pascal[i - 1][j - 1];
        const aboveRight = pascal[i - 1][j];
        pascal[i][j] = above + aboveRight;

        this.steps.push({
          data: flatten(),
          highlights: [
            { index: getIndex(i, j), color: COLORS.computing, label: `${pascal[i][j]}` },
            { index: getIndex(i - 1, j - 1), color: COLORS.dependency, label: `${above}` },
            { index: getIndex(i - 1, j), color: COLORS.dependency, label: `${aboveRight}` },
          ],
          comparisons: [[getIndex(i - 1, j - 1), getIndex(i - 1, j)]],
          swaps: [],
          sorted: [],
          stepDescription: `C(${i},${j}) = C(${i - 1},${j - 1}) + C(${i - 1},${j}) = ${above} + ${aboveRight} = ${pascal[i][j]}`,
        });
      }

      // Mark row complete
      const rowSorted: number[] = [];
      for (let j = 0; j <= i; j++) {
        rowSorted.push(getIndex(i, j));
      }

      this.steps.push({
        data: flatten(),
        highlights: rowSorted.map(idx => ({
          index: idx,
          color: COLORS.filled,
        })),
        comparisons: [],
        swaps: [],
        sorted: rowSorted,
        stepDescription: `Row ${i} complete: [${pascal[i].join(', ')}]`,
      });
    }

    // Highlight the target C(n, k)
    const targetIdx = getIndex(n, k);
    this.steps.push({
      data: flatten(),
      highlights: [
        { index: targetIdx, color: COLORS.result, label: `C(${n},${k})=${pascal[n][k]}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [targetIdx],
      stepDescription: `Result: C(${n}, ${k}) = ${pascal[n][k]}. There are ${pascal[n][k]} ways to choose ${k} items from ${n}.`,
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
