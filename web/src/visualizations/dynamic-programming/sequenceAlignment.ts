import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class SequenceAlignmentVisualization implements DPVisualizationEngine {
  name = 'Sequence Alignment';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const seq1 = input.text1 ?? 'GCATGCU';
    const seq2 = input.text2 ?? 'GATTACA';
    const m = seq1.length;
    const n = seq2.length;

    const gapPenalty = input.target ?? 1;
    const mismatchPenalty = 1;
    const matchReward = 0;

    const rowLabels = ['', ...seq1.split('')];
    const colLabels = ['', ...seq2.split('')];

    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    const cellColors: string[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(COLORS.empty));

    const makeTable = (): DPCell[][] =>
      dp.map((row, i) => row.map((v, j) => ({
        value: cellColors[i][j] === COLORS.empty ? '' : v,
        color: cellColors[i][j],
      })));

    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `Sequence Alignment: "${seq1}" vs "${seq2}". Gap penalty = ${gapPenalty}, mismatch = ${mismatchPenalty}. Minimize total cost.`,
    });

    // Base cases
    for (let i = 0; i <= m; i++) {
      dp[i][0] = i * gapPenalty;
      cellColors[i][0] = COLORS.computed;
    }
    for (let j = 0; j <= n; j++) {
      dp[0][j] = j * gapPenalty;
      cellColors[0][j] = COLORS.computed;
    }

    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: 'Base cases: aligning with empty sequence costs gap penalty per character.',
    });

    // Fill table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const depColors = cellColors.map(row => [...row]);
        depColors[i][j] = COLORS.computing;
        depColors[i - 1][j - 1] = COLORS.dependency;
        depColors[i - 1][j] = COLORS.dependency;
        depColors[i][j - 1] = COLORS.dependency;

        const matchCost = seq1[i - 1] === seq2[j - 1] ? matchReward : mismatchPenalty;
        const align = dp[i - 1][j - 1] + matchCost;
        const gap1 = dp[i - 1][j] + gapPenalty;
        const gap2 = dp[i][j - 1] + gapPenalty;
        const minVal = Math.min(align, gap1, gap2);
        const choice = minVal === align ? 'align' : minVal === gap1 ? 'gap in seq2' : 'gap in seq1';

        this.steps.push({
          table: dp.map((row, ri) => row.map((v, ci) => ({
            value: depColors[ri][ci] === COLORS.empty ? '' : v,
            color: depColors[ri][ci],
          }))),
          rowLabels,
          colLabels,
          currentCell: [i, j],
          arrows: [
            { from: [i, j], to: [i - 1, j - 1] },
            { from: [i, j], to: [i - 1, j] },
            { from: [i, j], to: [i, j - 1] },
          ],
          stepDescription: `'${seq1[i - 1]}' vs '${seq2[j - 1]}': align=${align}, gap in seq2=${gap1}, gap in seq1=${gap2}. Min=${minVal} (${choice}).`,
        });

        dp[i][j] = minVal;
        cellColors[i][j] = COLORS.computed;
      }
    }

    // Traceback
    const finalColors = cellColors.map(row => [...row]);
    let ti = m, tj = n;
    finalColors[ti][tj] = COLORS.optimal;
    while (ti > 0 || tj > 0) {
      if (ti > 0 && tj > 0) {
        const matchCost = seq1[ti - 1] === seq2[tj - 1] ? matchReward : mismatchPenalty;
        if (dp[ti][tj] === dp[ti - 1][tj - 1] + matchCost) {
          ti--; tj--;
        } else if (ti > 0 && dp[ti][tj] === dp[ti - 1][tj] + gapPenalty) {
          ti--;
        } else {
          tj--;
        }
      } else if (ti > 0) {
        ti--;
      } else {
        tj--;
      }
      finalColors[ti][tj] = COLORS.optimal;
    }

    this.steps.push({
      table: dp.map((row, ri) => row.map((v, ci) => ({ value: v, color: finalColors[ri][ci] }))),
      rowLabels,
      colLabels,
      currentCell: [m, n],
      arrows: [],
      stepDescription: `Minimum alignment cost = ${dp[m][n]}. Green path shows optimal alignment.`,
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
