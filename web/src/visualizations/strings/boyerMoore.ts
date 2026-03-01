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
 * Boyer-Moore Algorithm Visualization (Bad Character Heuristic)
 *
 * Compares pattern from right to left. On mismatch, uses the bad-character
 * table to skip ahead, achieving sublinear average performance.
 */
export class BoyerMooreVisualization implements StringVisualizationEngine {
  name = 'Boyer-Moore';
  visualizationType = 'string' as const;

  private steps: StringVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(text: string, pattern: string): StringVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = text.length;
    const m = pattern.length;

    // ── Phase 1: Build bad-character table ────────────────────────────
    const badChar: Record<string, number> = {};
    for (let i = 0; i < m; i++) {
      badChar[pattern[i]] = i;
    }

    const badCharDisplay: (number | string)[] = Object.entries(badChar).map(
      ([ch, idx]) => `${ch}:${idx}`
    );

    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Bad Char', values: badCharDisplay },
      ],
      stepDescription: `Bad-character table built: rightmost positions of each character in pattern.`,
    });

    // ── Phase 2: Search (right-to-left comparison) ───────────────────
    let s = 0;
    let matchFound = false;

    while (s <= n - m) {
      let j = m - 1;

      // Show alignment
      const textCellsAlign = makeTextCells(text);
      const patCellsAlign = makePatternCells(pattern);
      for (let k = 0; k < m; k++) {
        textCellsAlign[s + k] = { char: text[s + k], color: COLORS.comparing };
      }

      this.steps.push({
        text: textCellsAlign,
        pattern: patCellsAlign,
        patternOffset: s,
        auxiliaryData: [
          { label: 'Bad Char', values: badCharDisplay },
          { label: 'Offset', values: [s] },
        ],
        stepDescription: `Pattern aligned at offset ${s}. Comparing right-to-left from pattern[${j}].`,
      });

      // Compare right-to-left
      while (j >= 0 && pattern[j] === text[s + j]) {
        const textCellsCmp = makeTextCells(text);
        const patCellsCmp = makePatternCells(pattern);
        textCellsCmp[s + j] = { char: text[s + j], color: COLORS.match };
        patCellsCmp[j] = { char: pattern[j], color: COLORS.match };

        // Show previously matched chars
        for (let k = j + 1; k < m; k++) {
          textCellsCmp[s + k] = { char: text[s + k], color: COLORS.match };
          patCellsCmp[k] = { char: pattern[k], color: COLORS.match };
        }

        this.steps.push({
          text: textCellsCmp,
          pattern: patCellsCmp,
          patternOffset: s,
          auxiliaryData: [
            { label: 'Bad Char', values: badCharDisplay },
          ],
          stepDescription: `Match: text[${s + j}]='${text[s + j]}' == pattern[${j}]='${pattern[j]}'.`,
        });

        j--;
      }

      if (j < 0) {
        // Full match found
        matchFound = true;
        const textCellsFound = makeTextCells(text);
        const patCellsFound = makePatternCells(pattern);
        for (let k = 0; k < m; k++) {
          textCellsFound[s + k] = { char: text[s + k], color: COLORS.found };
          patCellsFound[k] = { char: pattern[k], color: COLORS.found };
        }

        this.steps.push({
          text: textCellsFound,
          pattern: patCellsFound,
          patternOffset: s,
          auxiliaryData: [
            { label: 'Bad Char', values: badCharDisplay },
          ],
          stepDescription: `Pattern found at index ${s}!`,
        });

        // Shift past this match
        s += (s + m < n && badChar[text[s + m]] !== undefined)
          ? m - badChar[text[s + m]]
          : 1;
      } else {
        // Mismatch at j
        const textCellsMiss = makeTextCells(text);
        const patCellsMiss = makePatternCells(pattern);
        textCellsMiss[s + j] = { char: text[s + j], color: COLORS.mismatch };
        patCellsMiss[j] = { char: pattern[j], color: COLORS.mismatch };

        // Show matched suffix
        for (let k = j + 1; k < m; k++) {
          textCellsMiss[s + k] = { char: text[s + k], color: COLORS.match };
          patCellsMiss[k] = { char: pattern[k], color: COLORS.match };
        }

        const bc = badChar[text[s + j]] !== undefined ? badChar[text[s + j]] : -1;
        let shiftAmount = j - bc;
        if (shiftAmount < 1) shiftAmount = 1;

        this.steps.push({
          text: textCellsMiss,
          pattern: patCellsMiss,
          patternOffset: s,
          auxiliaryData: [
            { label: 'Bad Char', values: badCharDisplay },
            { label: 'Shift', values: [`j=${j}, bc('${text[s + j]}')=${bc}, shift=${shiftAmount}`] },
          ],
          stepDescription: `Mismatch: text[${s + j}]='${text[s + j]}' != pattern[${j}]='${pattern[j]}'. Bad-char shift by ${shiftAmount}.`,
        });

        s += shiftAmount;
      }
    }

    // Final step
    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Bad Char', values: badCharDisplay },
      ],
      stepDescription: matchFound
        ? 'Boyer-Moore search complete. Pattern was found in the text.'
        : 'Boyer-Moore search complete. Pattern was not found in the text.',
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
