import type { StringVisualizationEngine, StringVisualizationState, CharCell } from '../types';

const COLORS = {
  default: '#e5e7eb',
  comparing: '#fbbf24',
  match: '#34d399',
  mismatch: '#f87171',
  found: '#60a5fa',
  shift: '#a855f7',
};

function makeTextCells(text: string): CharCell[] {
  return text.split('').map((char) => ({ char, color: COLORS.default }));
}

function makePatternCells(pattern: string): CharCell[] {
  return pattern.split('').map((char) => ({ char, color: COLORS.default }));
}

/**
 * Levenshtein Distance (Edit Distance) Visualization
 *
 * Computes the minimum number of single-character edits (insertions, deletions,
 * substitutions) needed to transform text into pattern using dynamic programming.
 * Visualizes the DP table being filled row by row.
 */
export class LevenshteinDistanceVisualization implements StringVisualizationEngine {
  name = 'Levenshtein Distance';
  visualizationType = 'string' as const;

  private steps: StringVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(text: string, pattern: string): StringVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = text.length;
    const m = pattern.length;

    // dp[i][j] = edit distance between text[0..i-1] and pattern[0..j-1]
    const dp: number[][] = Array.from({ length: n + 1 }, () =>
      new Array(m + 1).fill(0)
    );

    // Initialize base cases
    for (let i = 0; i <= n; i++) dp[i][0] = i;
    for (let j = 0; j <= m; j++) dp[0][j] = j;

    // Format the DP table as flat rows for auxiliaryData display
    const formatTable = (): (number | string)[] => {
      const header = ['', ...pattern.split('').map((c) => c)];
      const rows: (number | string)[] = [...header];
      for (let i = 0; i <= n; i++) {
        const label = i === 0 ? '' : text[i - 1];
        rows.push(label);
        for (let j = 0; j <= m; j++) {
          rows.push(dp[i][j]);
        }
      }
      return rows;
    };

    // Show initial state with base cases
    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'DP Table', values: formatTable() },
        { label: 'Dimensions', values: [`${n + 1}x${m + 1}`] },
      ],
      stepDescription: `Initialize DP table. Base cases: dp[i][0]=i (delete i chars), dp[0][j]=j (insert j chars).`,
    });

    // ── Fill DP table ────────────────────────────────────────────────
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        const textCells = makeTextCells(text);
        const patCells = makePatternCells(pattern);

        textCells[i - 1] = { char: text[i - 1], color: COLORS.comparing };
        patCells[j - 1] = { char: pattern[j - 1], color: COLORS.comparing };

        if (text[i - 1] === pattern[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];

          textCells[i - 1] = { char: text[i - 1], color: COLORS.match };
          patCells[j - 1] = { char: pattern[j - 1], color: COLORS.match };

          this.steps.push({
            text: textCells,
            pattern: patCells,
            patternOffset: 0,
            auxiliaryData: [
              { label: 'DP Table', values: formatTable() },
              { label: 'Cell', values: [`(${i},${j})`] },
              { label: 'Operation', values: ['match'] },
            ],
            stepDescription: `text[${i - 1}]='${text[i - 1]}' == pattern[${j - 1}]='${pattern[j - 1]}'. dp[${i}][${j}] = dp[${i - 1}][${j - 1}] = ${dp[i][j]} (no edit needed).`,
          });
        } else {
          const deleteCost = dp[i - 1][j] + 1;
          const insertCost = dp[i][j - 1] + 1;
          const replaceCost = dp[i - 1][j - 1] + 1;
          dp[i][j] = Math.min(deleteCost, insertCost, replaceCost);

          let operation = 'replace';
          if (dp[i][j] === deleteCost) operation = 'delete';
          else if (dp[i][j] === insertCost) operation = 'insert';

          textCells[i - 1] = { char: text[i - 1], color: COLORS.mismatch };
          patCells[j - 1] = { char: pattern[j - 1], color: COLORS.mismatch };

          this.steps.push({
            text: textCells,
            pattern: patCells,
            patternOffset: 0,
            auxiliaryData: [
              { label: 'DP Table', values: formatTable() },
              { label: 'Cell', values: [`(${i},${j})`] },
              { label: 'Costs', values: [`del=${deleteCost}`, `ins=${insertCost}`, `rep=${replaceCost}`] },
            ],
            stepDescription: `text[${i - 1}]='${text[i - 1]}' != pattern[${j - 1}]='${pattern[j - 1]}'. dp[${i}][${j}] = min(${deleteCost},${insertCost},${replaceCost}) = ${dp[i][j]} (${operation}).`,
          });
        }
      }
    }

    // ── Backtrace to show optimal alignment ──────────────────────────
    const textCellsFinal = makeTextCells(text);
    const patCellsFinal = makePatternCells(pattern);

    // Trace back to highlight aligned characters
    let ti = n, pj = m;
    while (ti > 0 && pj > 0) {
      if (text[ti - 1] === pattern[pj - 1]) {
        textCellsFinal[ti - 1] = { char: text[ti - 1], color: COLORS.found };
        patCellsFinal[pj - 1] = { char: pattern[pj - 1], color: COLORS.found };
        ti--;
        pj--;
      } else if (dp[ti][pj] === dp[ti - 1][pj - 1] + 1) {
        textCellsFinal[ti - 1] = { char: text[ti - 1], color: COLORS.shift };
        patCellsFinal[pj - 1] = { char: pattern[pj - 1], color: COLORS.shift };
        ti--;
        pj--;
      } else if (dp[ti][pj] === dp[ti - 1][pj] + 1) {
        textCellsFinal[ti - 1] = { char: text[ti - 1], color: COLORS.mismatch };
        ti--;
      } else {
        patCellsFinal[pj - 1] = { char: pattern[pj - 1], color: COLORS.mismatch };
        pj--;
      }
    }

    this.steps.push({
      text: textCellsFinal,
      pattern: patCellsFinal,
      patternOffset: 0,
      auxiliaryData: [
        { label: 'DP Table', values: formatTable() },
        { label: 'Distance', values: [dp[n][m]] },
      ],
      stepDescription: `Levenshtein distance complete. Edit distance between "${text}" and "${pattern}" is ${dp[n][m]}.`,
    });

    return this.steps[0];
  }

  step(): StringVisualizationState | null {
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
