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
 * Longest Palindromic Substring — Expand Around Center
 *
 * For each possible center (both single-char and between-char centers),
 * expand outward while characters match. Track the longest palindrome found.
 * The text parameter is used as the input string; pattern is ignored for the
 * algorithm but shown for UI consistency.
 */
export class LongestPalindromicSubstringVisualization implements StringVisualizationEngine {
  name = 'Longest Palindromic Substring';
  visualizationType = 'string' as const;

  private steps: StringVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(text: string, _pattern: string): StringVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const s = text; // work on the text string
    const n = s.length;
    let bestStart = 0;
    let bestLen = 1;

    this.steps.push({
      text: makeTextCells(s),
      pattern: makePatternCells(_pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Best', values: [s[0]] },
        { label: 'Length', values: [1] },
      ],
      stepDescription: `Finding the longest palindromic substring in "${s}" by expanding around each center.`,
    });

    // Helper: expand around center and record steps
    const expandAroundCenter = (left: number, right: number, centerLabel: string) => {
      // Show the center being tested
      const textCellsCenter = makeTextCells(s);
      if (left === right) {
        textCellsCenter[left] = { char: s[left], color: COLORS.shift };
      } else {
        textCellsCenter[left] = { char: s[left], color: COLORS.shift };
        textCellsCenter[right] = { char: s[right], color: COLORS.shift };
      }

      this.steps.push({
        text: textCellsCenter,
        pattern: makePatternCells(_pattern),
        patternOffset: 0,
        auxiliaryData: [
          { label: 'Center', values: [centerLabel] },
          { label: 'Best', values: [s.substring(bestStart, bestStart + bestLen)] },
        ],
        stepDescription: `Expanding around center ${centerLabel}.`,
      });

      while (left >= 0 && right < n && s[left] === s[right]) {
        const textCellsMatch = makeTextCells(s);
        // Highlight the current palindrome
        for (let k = left; k <= right; k++) {
          textCellsMatch[k] = { char: s[k], color: COLORS.match };
        }

        const palLen = right - left + 1;
        if (palLen > bestLen) {
          bestStart = left;
          bestLen = palLen;
        }

        this.steps.push({
          text: textCellsMatch,
          pattern: makePatternCells(_pattern),
          patternOffset: 0,
          auxiliaryData: [
            { label: 'Center', values: [centerLabel] },
            { label: 'Palindrome', values: [s.substring(left, right + 1)] },
            { label: 'Best', values: [s.substring(bestStart, bestStart + bestLen)] },
          ],
          stepDescription: `s[${left}]='${s[left]}' == s[${right}]='${s[right]}'. Palindrome "${s.substring(left, right + 1)}" (length ${palLen}).`,
        });

        left--;
        right++;
      }

      // Show mismatch if expansion stopped before bounds
      if (left >= 0 && right < n && s[left] !== s[right]) {
        const textCellsMiss = makeTextCells(s);
        textCellsMiss[left] = { char: s[left], color: COLORS.mismatch };
        textCellsMiss[right] = { char: s[right], color: COLORS.mismatch };

        this.steps.push({
          text: textCellsMiss,
          pattern: makePatternCells(_pattern),
          patternOffset: 0,
          auxiliaryData: [
            { label: 'Center', values: [centerLabel] },
            { label: 'Best', values: [s.substring(bestStart, bestStart + bestLen)] },
          ],
          stepDescription: `s[${left}]='${s[left]}' != s[${right}]='${s[right]}'. Stop expanding.`,
        });
      }
    };

    // Try each center
    for (let i = 0; i < n; i++) {
      // Odd-length palindromes (single-char center)
      expandAroundCenter(i, i, `${i} (odd)`);

      // Even-length palindromes (between-char center)
      if (i < n - 1) {
        expandAroundCenter(i, i + 1, `${i},${i + 1} (even)`);
      }
    }

    // Final result
    const textCellsFinal = makeTextCells(s);
    for (let k = bestStart; k < bestStart + bestLen; k++) {
      textCellsFinal[k] = { char: s[k], color: COLORS.found };
    }

    this.steps.push({
      text: textCellsFinal,
      pattern: makePatternCells(_pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Result', values: [s.substring(bestStart, bestStart + bestLen)] },
        { label: 'Start', values: [bestStart] },
        { label: 'Length', values: [bestLen] },
      ],
      stepDescription: `Longest palindromic substring: "${s.substring(bestStart, bestStart + bestLen)}" at index ${bestStart} (length ${bestLen}).`,
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
