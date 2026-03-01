import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class FibonacciVisualization implements DPVisualizationEngine {
  name = 'Fibonacci (DP)';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = input.values?.[0] ?? 8;
    const size = Math.max(2, Math.min(n, 30));

    const colLabels = Array.from({ length: size + 1 }, (_, i) => String(i));
    const rowLabels = ['F(n)'];

    const makeTable = (dp: (number | string)[], colors: string[]): DPCell[][] => {
      return [dp.map((v, i) => ({ value: v, color: colors[i] }))];
    };

    const dp: (number | string)[] = new Array(size + 1).fill('');
    const cellColors: string[] = new Array(size + 1).fill(COLORS.empty);

    // Initial state
    this.steps.push({
      table: makeTable(dp, cellColors),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `Computing Fibonacci numbers from F(0) to F(${size}) using bottom-up DP.`,
    });

    // Base cases
    dp[0] = 0;
    cellColors[0] = COLORS.computing;
    this.steps.push({
      table: makeTable(dp, cellColors),
      rowLabels,
      colLabels,
      currentCell: [0, 0],
      arrows: [],
      stepDescription: 'Base case: F(0) = 0.',
    });
    cellColors[0] = COLORS.computed;

    dp[1] = 1;
    cellColors[1] = COLORS.computing;
    this.steps.push({
      table: makeTable(dp, cellColors),
      rowLabels,
      colLabels,
      currentCell: [0, 1],
      arrows: [],
      stepDescription: 'Base case: F(1) = 1.',
    });
    cellColors[1] = COLORS.computed;

    // Fill rest
    for (let i = 2; i <= size; i++) {
      // Show dependencies
      const depColors = [...cellColors];
      depColors[i - 1] = COLORS.dependency;
      depColors[i - 2] = COLORS.dependency;
      depColors[i] = COLORS.computing;
      dp[i] = '';
      this.steps.push({
        table: makeTable(dp, depColors),
        rowLabels,
        colLabels,
        currentCell: [0, i],
        arrows: [
          { from: [0, i], to: [0, i - 1] },
          { from: [0, i], to: [0, i - 2] },
        ],
        stepDescription: `Computing F(${i}) = F(${i - 1}) + F(${i - 2}) = ${dp[i - 1]} + ${dp[i - 2]}.`,
      });

      // Compute value
      dp[i] = (dp[i - 1] as number) + (dp[i - 2] as number);
      cellColors[i] = COLORS.computed;
      this.steps.push({
        table: makeTable(dp, cellColors),
        rowLabels,
        colLabels,
        currentCell: [0, i],
        arrows: [],
        stepDescription: `F(${i}) = ${dp[i]}.`,
      });
    }

    // Final state - highlight result
    const finalColors = cellColors.map((c) => (c === COLORS.computed ? COLORS.computed : c));
    finalColors[size] = COLORS.optimal;
    this.steps.push({
      table: makeTable(dp, finalColors),
      rowLabels,
      colLabels,
      currentCell: [0, size],
      arrows: [],
      stepDescription: `Result: F(${size}) = ${dp[size]}.`,
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
