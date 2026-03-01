import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class SosDpVisualization implements DPVisualizationEngine {
  name = 'Sum over Subsets DP';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // SOS DP: for each bitmask, compute sum of f[submask] for all submasks
    const bits = Math.min(input.target ?? 3, 3); // cap at 3 bits (8 entries)
    const total = 1 << bits;
    const vals = input.values ?? [1, 5, 8, 9, 10, 17, 17, 20];

    const f: number[] = Array.from({ length: total }, (_, i) => vals[i % vals.length]);
    const dp: number[] = [...f]; // dp will accumulate SOS

    const maskStr = (mask: number): string => mask.toString(2).padStart(bits, '0');

    const rowLabels = ['f(x)', 'SOS'];
    const colLabels = Array.from({ length: total }, (_, i) => maskStr(i));
    const cellColors: string[][] = [
      new Array(total).fill(COLORS.computed),
      new Array(total).fill(COLORS.empty),
    ];

    // Initialize SOS row with original values
    const sosDisplay: number[] = [...f];

    const makeTable = (): DPCell[][] => [
      f.map((v, j) => ({ value: v, color: cellColors[0][j] })),
      sosDisplay.map((v, j) => ({
        value: cellColors[1][j] === COLORS.empty ? '' : v,
        color: cellColors[1][j],
      })),
    ];

    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `SOS DP: for each mask, compute sum of f[submask] over all submasks. ${bits} bits, ${total} values.`,
    });

    // Show initial SOS = f values
    for (let i = 0; i < total; i++) {
      cellColors[1][i] = COLORS.computed;
    }

    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: 'Initialize SOS[mask] = f[mask] for all masks.',
    });

    // Process each bit dimension
    for (let bit = 0; bit < bits; bit++) {
      for (let mask = 0; mask < total; mask++) {
        if (mask & (1 << bit)) {
          // dp[mask] += dp[mask ^ (1 << bit)]
          const subMask = mask ^ (1 << bit);

          const depColors = cellColors.map(row => [...row]);
          depColors[1][mask] = COLORS.computing;
          depColors[1][subMask] = COLORS.dependency;

          dp[mask] += dp[subMask];
          sosDisplay[mask] = dp[mask];

          this.steps.push({
            table: [
              f.map((v, j) => ({ value: v, color: depColors[0][j] })),
              sosDisplay.map((v, j) => ({
                value: depColors[1][j] === COLORS.empty ? '' : v,
                color: depColors[1][j],
              })),
            ],
            rowLabels,
            colLabels,
            currentCell: [1, mask],
            arrows: [{ from: [1, mask], to: [1, subMask] }],
            stepDescription: `Bit ${bit}: SOS[${maskStr(mask)}] += SOS[${maskStr(subMask)}]. New value = ${dp[mask]}.`,
          });
        }
      }
    }

    // Final
    const finalColors = cellColors.map(row => [...row]);
    finalColors[1][total - 1] = COLORS.optimal;

    this.steps.push({
      table: [
        f.map((v, j) => ({ value: v, color: finalColors[0][j] })),
        sosDisplay.map((v, j) => ({ value: v, color: finalColors[1][j] })),
      ],
      rowLabels,
      colLabels,
      currentCell: [1, total - 1],
      arrows: [],
      stepDescription: `SOS DP complete. SOS[${maskStr(total - 1)}] = ${dp[total - 1]} (sum of all f values). Each cell holds sum of all submask values.`,
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
