import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class ConvexHullTrickVisualization implements DPVisualizationEngine {
  name = 'Convex Hull Trick';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // DP recurrence: dp[i] = min over j < i of (dp[j] + cost(j,i))
    // Using a 1D partitioning: dp[i] = min_{j<i} (dp[j] + (prefixSum[i] - prefixSum[j])^2)
    const arr = input.values ?? [1, 5, 8, 9, 10, 17, 17, 20];
    const n = arr.length;

    const prefix: number[] = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + arr[i];

    const dp: number[] = new Array(n + 1).fill(0);
    const from: number[] = new Array(n + 1).fill(0);

    const rowLabels = ['prefix', 'dp', 'from'];
    const colLabels = Array.from({ length: n + 1 }, (_, i) => String(i));

    const cellColors: string[][] = [
      new Array(n + 1).fill(COLORS.computed),
      new Array(n + 1).fill(COLORS.empty),
      new Array(n + 1).fill(COLORS.empty),
    ];

    const makeTable = (): DPCell[][] => [
      prefix.map((v, j) => ({ value: v, color: cellColors[0][j] })),
      dp.map((v, j) => ({ value: cellColors[1][j] === COLORS.empty ? '' : v, color: cellColors[1][j] })),
      from.map((v, j) => ({ value: cellColors[2][j] === COLORS.empty ? '' : v, color: cellColors[2][j] })),
    ];

    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `Convex Hull Trick optimization on DP: dp[i] = min_{j<i}(dp[j] + (prefix[i]-prefix[j])^2). Values = [${arr.join(', ')}].`,
    });

    // Base case
    dp[0] = 0;
    from[0] = 0;
    cellColors[1][0] = COLORS.computed;
    cellColors[2][0] = COLORS.computed;

    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: [1, 0],
      arrows: [],
      stepDescription: 'Base case: dp[0] = 0.',
    });

    // Lines for CHT: line from j has slope = -2*prefix[j], intercept = dp[j] + prefix[j]^2
    // Query at x = prefix[i], dp[i] = result + prefix[i]^2
    const lines: { m: number; b: number; j: number }[] = [];

    const addLine = (m: number, b: number, j: number) => {
      while (lines.length >= 2) {
        const l1 = lines[lines.length - 2];
        const l2 = lines[lines.length - 1];
        // Check if l2 is redundant
        if ((b - l1.b) * (l1.m - l2.m) <= (l2.b - l1.b) * (l1.m - m)) {
          lines.pop();
        } else {
          break;
        }
      }
      lines.push({ m, b, j });
    };

    const query = (x: number): { val: number; j: number } => {
      let lo = 0, hi = lines.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (lines[mid].m * x + lines[mid].b <= lines[mid + 1].m * x + lines[mid + 1].b) {
          hi = mid;
        } else {
          lo = mid + 1;
        }
      }
      return { val: lines[lo].m * x + lines[lo].b, j: lines[lo].j };
    };

    // Add line for j=0
    addLine(-2 * prefix[0], dp[0] + prefix[0] * prefix[0], 0);

    for (let i = 1; i <= n; i++) {
      const { val, j: bestJ } = query(prefix[i]);
      dp[i] = val + prefix[i] * prefix[i];
      from[i] = bestJ;

      const depColors = cellColors.map(row => [...row]);
      depColors[1][i] = COLORS.computing;
      depColors[1][bestJ] = COLORS.dependency;

      this.steps.push({
        table: [
          prefix.map((v, k) => ({ value: v, color: depColors[0][k] })),
          dp.map((v, k) => ({
            value: depColors[1][k] === COLORS.empty ? '' : v,
            color: depColors[1][k],
          })),
          from.map((v, k) => ({
            value: depColors[2][k] === COLORS.empty ? '' : v,
            color: depColors[2][k],
          })),
        ],
        rowLabels,
        colLabels,
        currentCell: [1, i],
        arrows: [{ from: [1, i], to: [1, bestJ] }],
        stepDescription: `dp[${i}]: CHT query at x=${prefix[i]}, best split from j=${bestJ}. dp[${i}] = dp[${bestJ}] + (${prefix[i]}-${prefix[bestJ]})^2 = ${dp[i]}.`,
      });

      cellColors[1][i] = COLORS.computed;
      cellColors[2][i] = COLORS.computed;

      // Add line for this position
      addLine(-2 * prefix[i], dp[i] + prefix[i] * prefix[i], i);
    }

    // Traceback
    const finalColors = cellColors.map(row => [...row]);
    let cur = n;
    while (cur > 0) {
      finalColors[1][cur] = COLORS.optimal;
      cur = from[cur];
    }
    finalColors[1][0] = COLORS.optimal;

    this.steps.push({
      table: [
        prefix.map((v, k) => ({ value: v, color: finalColors[0][k] })),
        dp.map((v, k) => ({ value: v, color: finalColors[1][k] })),
        from.map((v, k) => ({ value: v, color: finalColors[2][k] })),
      ],
      rowLabels,
      colLabels,
      currentCell: [1, n],
      arrows: [],
      stepDescription: `Minimum cost = ${dp[n]}. Green cells show the optimal partition points.`,
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
