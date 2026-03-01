import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class KnapsackVisualization implements DPVisualizationEngine {
  name = '0/1 Knapsack';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const itemValues = input.values ?? [60, 100, 120];
    const weights = input.weights ?? [10, 20, 30];
    const capacity = input.target ?? 50;
    const n = itemValues.length;

    const rowLabels = ['0', ...itemValues.map((v, i) => `v=${v},w=${weights[i]}`)];
    const colLabels = Array.from({ length: capacity + 1 }, (_, i) => String(i));

    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));
    const cellColors: string[][] = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(COLORS.empty));

    const makeTable = (): DPCell[][] =>
      dp.map((row, i) => row.map((v, j) => ({ value: cellColors[i][j] === COLORS.empty ? '' : v, color: cellColors[i][j] })));

    // Initial state
    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `0/1 Knapsack: ${n} items, capacity = ${capacity}. Values: [${itemValues.join(', ')}], Weights: [${weights.join(', ')}].`,
    });

    // Initialize first row (no items)
    for (let j = 0; j <= capacity; j++) {
      cellColors[0][j] = COLORS.computed;
    }
    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: 'Base case: with 0 items, maximum value is always 0.',
    });

    // Fill table
    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        const arrows: { from: [number, number]; to: [number, number] }[] = [];
        const depColors = cellColors.map((row) => [...row]);
        depColors[i][w] = COLORS.computing;

        if (weights[i - 1] <= w) {
          // Can include this item
          depColors[i - 1][w] = COLORS.dependency;
          depColors[i - 1][w - weights[i - 1]] = COLORS.dependency;
          arrows.push({ from: [i, w], to: [i - 1, w] });
          arrows.push({ from: [i, w], to: [i - 1, w - weights[i - 1]] });

          const includeVal = dp[i - 1][w - weights[i - 1]] + itemValues[i - 1];
          const excludeVal = dp[i - 1][w];

          this.steps.push({
            table: dp.map((row, ri) => row.map((v, ci) => ({
              value: depColors[ri][ci] === COLORS.empty ? '' : v,
              color: depColors[ri][ci],
            }))),
            rowLabels,
            colLabels,
            currentCell: [i, w],
            arrows,
            stepDescription: `Item ${i} (w=${weights[i - 1]}, v=${itemValues[i - 1]}), capacity ${w}: max(exclude=${excludeVal}, include=${includeVal}).`,
          });

          dp[i][w] = Math.max(excludeVal, includeVal);
        } else {
          // Cannot include this item
          depColors[i - 1][w] = COLORS.dependency;
          arrows.push({ from: [i, w], to: [i - 1, w] });

          this.steps.push({
            table: dp.map((row, ri) => row.map((v, ci) => ({
              value: depColors[ri][ci] === COLORS.empty ? '' : v,
              color: depColors[ri][ci],
            }))),
            rowLabels,
            colLabels,
            currentCell: [i, w],
            arrows,
            stepDescription: `Item ${i} (w=${weights[i - 1]}) too heavy for capacity ${w}. Skip: dp[${i}][${w}] = dp[${i - 1}][${w}] = ${dp[i - 1][w]}.`,
          });

          dp[i][w] = dp[i - 1][w];
        }

        cellColors[i][w] = COLORS.computed;
        this.steps.push({
          table: makeTable(),
          rowLabels,
          colLabels,
          currentCell: [i, w],
          arrows: [],
          stepDescription: `dp[${i}][${w}] = ${dp[i][w]}.`,
        });
      }
    }

    // Traceback for optimal items
    const finalColors = cellColors.map((row) => [...row]);
    let wi = capacity;
    for (let i = n; i > 0; i--) {
      if (dp[i][wi] !== dp[i - 1][wi]) {
        finalColors[i][wi] = COLORS.optimal;
        wi -= weights[i - 1];
      }
    }
    finalColors[n][capacity] = COLORS.optimal;

    this.steps.push({
      table: dp.map((row, ri) => row.map((v, ci) => ({ value: v, color: finalColors[ri][ci] }))),
      rowLabels,
      colLabels,
      currentCell: [n, capacity],
      arrows: [],
      stepDescription: `Maximum value = ${dp[n][capacity]}. Green cells indicate where items were included.`,
    });

    return this.steps[0];
  }

  step(): DPVisualizationState | null {
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
