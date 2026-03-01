import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class BitmaskDpVisualization implements DPVisualizationEngine {
  name = 'Bitmask DP';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Assignment problem: n workers, n jobs.
    // Build a small cost matrix from input values.
    const vals = input.values ?? [1, 5, 8, 9, 10, 17, 17, 20];
    const n = Math.min(input.target ?? 4, 4); // cap at 4 to keep table manageable (2^4 = 16)
    const cost: number[][] = [];
    for (let i = 0; i < n; i++) {
      const row: number[] = [];
      for (let j = 0; j < n; j++) {
        row.push(vals[(i * n + j) % vals.length]);
      }
      cost.push(row);
    }

    const total = 1 << n;
    const INF = 99999;

    const popcount = (x: number): number => {
      let c = 0;
      let v = x;
      while (v) { c += v & 1; v >>= 1; }
      return c;
    };

    const maskStr = (mask: number): string => {
      return mask.toString(2).padStart(n, '0');
    };

    const rowLabels = ['dp'];
    const colLabels = Array.from({ length: total }, (_, i) => maskStr(i));

    const dp: number[] = new Array(total).fill(INF);
    dp[0] = 0;
    const cellColors: string[] = new Array(total).fill(COLORS.empty);

    const makeTable = (): DPCell[][] => [
      dp.map((v, j) => ({
        value: cellColors[j] === COLORS.empty ? '' : (v >= INF ? '\u221E' : v),
        color: cellColors[j],
      })),
    ];

    this.steps.push({
      table: [cost.map((row) => row.map((v) => ({
        value: v,
        color: COLORS.computed,
      })))].flat(),
      rowLabels: cost.map((_, i) => `W${i}`),
      colLabels: Array.from({ length: n }, (_, j) => `J${j}`),
      currentCell: null,
      arrows: [],
      stepDescription: `Bitmask DP: ${n}x${n} assignment problem. Cost matrix shown. Minimize total cost.`,
    });

    cellColors[0] = COLORS.computed;
    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: [0, 0],
      arrows: [],
      stepDescription: `dp[${maskStr(0)}] = 0. No jobs assigned, zero cost.`,
    });

    // Process each mask
    for (let mask = 0; mask < total; mask++) {
      if (dp[mask] >= INF) continue;
      const worker = popcount(mask);
      if (worker >= n) continue;

      for (let job = 0; job < n; job++) {
        if (mask & (1 << job)) continue;
        const newMask = mask | (1 << job);
        const newCost = dp[mask] + cost[worker][job];

        if (newCost < dp[newMask]) {
          const depColors = [...cellColors];
          depColors[newMask] = COLORS.computing;
          depColors[mask] = COLORS.dependency;

          dp[newMask] = newCost;

          this.steps.push({
            table: [dp.map((v, j) => ({
              value: depColors[j] === COLORS.empty ? '' : (v >= INF ? '\u221E' : v),
              color: depColors[j],
            }))],
            rowLabels,
            colLabels,
            currentCell: [0, newMask],
            arrows: [{ from: [0, newMask], to: [0, mask] }],
            stepDescription: `Worker ${worker} -> Job ${job}: dp[${maskStr(newMask)}] = dp[${maskStr(mask)}] + cost[${worker}][${job}] = ${dp[mask] - cost[worker][job]} + ${cost[worker][job]} = ${newCost}.`,
          });

          cellColors[newMask] = COLORS.computed;
        }
      }
    }

    // Final
    const finalColors = [...cellColors];
    finalColors[total - 1] = COLORS.optimal;

    this.steps.push({
      table: [dp.map((v, j) => ({
        value: v >= INF ? '\u221E' : v,
        color: finalColors[j],
      }))],
      rowLabels,
      colLabels,
      currentCell: [0, total - 1],
      arrows: [],
      stepDescription: `Minimum assignment cost = ${dp[total - 1] >= INF ? 'impossible' : dp[total - 1]}. All workers assigned optimally.`,
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
