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
 * Z-Algorithm Visualization
 *
 * Computes the Z-array for the concatenated string "pattern$text", where
 * Z[i] is the length of the longest substring starting at i that is also
 * a prefix of the string. Pattern matches occur where Z[i] equals the
 * pattern length.
 *
 * Maintains a Z-box [L, R] for the rightmost interval that matched a prefix.
 */
export class ZAlgorithmVisualization implements StringVisualizationEngine {
  name = 'Z-Algorithm';
  visualizationType = 'string' as const;

  private steps: StringVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(text: string, pattern: string): StringVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const m = pattern.length;
    const concat = pattern + '$' + text;
    const n = concat.length;

    const Z: number[] = new Array(n).fill(0);
    Z[0] = n; // by convention

    let L = 0;
    let R = 0;

    // Display a window of the Z-array focused on the relevant portion
    const zDisplay = (arr: number[]): (number | string)[] => {
      const display: (number | string)[] = [];
      for (let i = 0; i < arr.length; i++) {
        if (i < m) {
          display.push(arr[i] > 0 ? arr[i] : '-');
        } else if (i === m) {
          display.push('$');
        } else {
          display.push(arr[i] > 0 ? arr[i] : '-');
        }
      }
      return display;
    };

    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Concat', values: concat.split('').slice(0, 20) },
        { label: 'Z', values: zDisplay(Z) },
        { label: 'L,R', values: [`${L},${R}`] },
      ],
      stepDescription: `Z-Algorithm: concatenated string "${concat.length > 30 ? concat.substring(0, 30) + '..' : concat}". Computing Z-array.`,
    });

    for (let i = 1; i < n; i++) {
      // Step 1: Initialize Z[i] using the Z-box
      if (i < R) {
        Z[i] = Math.min(R - i, Z[i - L]);
      }

      // Step 2: Extend Z[i] by comparing characters
      const extendStart = Z[i];
      while (i + Z[i] < n && concat[Z[i]] === concat[i + Z[i]]) {
        Z[i]++;
      }
      const extended = Z[i] > extendStart;

      // Step 3: Update L, R if needed
      if (i + Z[i] > R) {
        L = i;
        R = i + Z[i];
      }

      // Map index back to text/pattern positions for highlighting
      const textCells = makeTextCells(text);
      const patCells = makePatternCells(pattern);

      // If index is in the text portion (after pattern$)
      const textOffset = m + 1; // pattern + '$'
      if (i >= textOffset && Z[i] > 0) {
        const textIdx = i - textOffset;
        // Highlight matching characters in text
        for (let k = 0; k < Z[i] && textIdx + k < text.length; k++) {
          textCells[textIdx + k] = { char: text[textIdx + k], color: COLORS.match };
        }
        // Highlight matching prefix in pattern
        for (let k = 0; k < Z[i] && k < m; k++) {
          patCells[k] = { char: pattern[k], color: COLORS.match };
        }
      }

      // Only record steps for interesting positions (non-zero Z-values or text portion)
      if (i >= textOffset || Z[i] > 0 || extended) {
        this.steps.push({
          text: textCells,
          pattern: patCells,
          patternOffset: i >= textOffset ? i - textOffset : 0,
          auxiliaryData: [
            { label: 'Z', values: zDisplay(Z) },
            { label: 'L,R', values: [`${L},${R}`] },
            { label: 'i', values: [i] },
            { label: 'Z[i]', values: [Z[i]] },
          ],
          stepDescription: i >= textOffset
            ? `i=${i} (text[${i - textOffset}]): Z[${i}]=${Z[i]}${Z[i] === m ? ' -- PATTERN MATCH!' : ''}.`
            : `i=${i} (pattern portion): Z[${i}]=${Z[i]}.`,
        });
      }

      // If Z[i] equals pattern length, we found a match
      if (i >= textOffset && Z[i] === m) {
        const matchIdx = i - textOffset;
        const textCellsFound = makeTextCells(text);
        const patCellsFound = makePatternCells(pattern);
        for (let k = 0; k < m; k++) {
          textCellsFound[matchIdx + k] = { char: text[matchIdx + k], color: COLORS.found };
          patCellsFound[k] = { char: pattern[k], color: COLORS.found };
        }

        this.steps.push({
          text: textCellsFound,
          pattern: patCellsFound,
          patternOffset: matchIdx,
          auxiliaryData: [
            { label: 'Z', values: zDisplay(Z) },
            { label: 'Match', values: [`index ${matchIdx}`] },
          ],
          stepDescription: `Pattern found at text index ${matchIdx}! Z[${i}]=${m} equals pattern length.`,
        });
      }
    }

    // Collect all matches
    const matches: number[] = [];
    for (let i = m + 1; i < n; i++) {
      if (Z[i] === m) {
        matches.push(i - m - 1);
      }
    }

    // Final step
    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Matches', values: matches.length > 0 ? matches : ['none'] },
      ],
      stepDescription: matches.length > 0
        ? `Z-Algorithm complete. Pattern found at index(es): [${matches.join(', ')}].`
        : 'Z-Algorithm complete. Pattern was not found in the text.',
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
