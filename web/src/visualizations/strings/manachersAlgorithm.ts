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
 * Manacher's Algorithm Visualization
 *
 * Finds the longest palindromic substring in O(n) time by exploiting
 * symmetry of palindromes. Uses a transformed string with '#' separators
 * so that both odd and even-length palindromes are handled uniformly.
 * Maintains a center C and right boundary R of the rightmost palindrome found.
 */
export class ManachersAlgorithmVisualization implements StringVisualizationEngine {
  name = "Manacher's Algorithm";
  visualizationType = 'string' as const;

  private steps: StringVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(text: string, _pattern: string): StringVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const s = text;
    const n = s.length;

    // Transform: "abc" -> "#a#b#c#"
    let t = '#';
    for (let i = 0; i < n; i++) {
      t += s[i] + '#';
    }
    const tLen = t.length;

    const P: number[] = new Array(tLen).fill(0); // P[i] = palindrome radius at i in transformed string
    let C = 0; // center of the rightmost palindrome
    let R = 0; // right boundary of the rightmost palindrome

    this.steps.push({
      text: makeTextCells(s),
      pattern: makePatternCells(_pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Transformed', values: t.split('') },
        { label: 'P', values: P.map(() => '-') },
        { label: 'C', values: [C] },
        { label: 'R', values: [R] },
      ],
      stepDescription: `Manacher's algorithm. Transformed string: "${t}" (length ${tLen}). Finding all palindrome radii.`,
    });

    let bestCenter = 0;
    let bestRadius = 0;

    for (let i = 0; i < tLen; i++) {
      // Mirror of i with respect to C
      const mirror = 2 * C - i;

      // Use mirror information if within the right boundary
      if (i < R) {
        P[i] = Math.min(R - i, P[mirror]);
      }

      // Show initial P[i] from mirror
      const pDisplay = P.map((v, idx) => (idx <= i ? v : '-'));
      this.steps.push({
        text: makeTextCells(s),
        pattern: makePatternCells(_pattern),
        patternOffset: 0,
        auxiliaryData: [
          { label: 'Transformed', values: t.split('') },
          { label: 'P', values: pDisplay },
          { label: 'C', values: [C] },
          { label: 'R', values: [R] },
          { label: 'i', values: [i] },
        ],
        stepDescription: i < R
          ? `i=${i}: mirror=${mirror}, P[mirror]=${P[mirror]}, R-i=${R - i}. Start with P[${i}]=${P[i]}.`
          : `i=${i}: outside right boundary R=${R}. Start with P[${i}]=0.`,
      });

      // Attempt to expand around center i
      let expanded = false;
      while (
        i + P[i] + 1 < tLen &&
        i - P[i] - 1 >= 0 &&
        t[i + P[i] + 1] === t[i - P[i] - 1]
      ) {
        P[i]++;
        expanded = true;
      }

      if (expanded) {
        // Show the expansion result
        const textCellsExpand = makeTextCells(s);
        // Map the palindrome in transformed string back to original
        const palStart = Math.floor((i - P[i]) / 2);
        const palEnd = Math.floor((i + P[i]) / 2);
        for (let k = palStart; k < palEnd; k++) {
          if (k >= 0 && k < n) {
            textCellsExpand[k] = { char: s[k], color: COLORS.match };
          }
        }

        const pDisplay2 = P.map((v, idx) => (idx <= i ? v : '-'));
        this.steps.push({
          text: textCellsExpand,
          pattern: makePatternCells(_pattern),
          patternOffset: 0,
          auxiliaryData: [
            { label: 'Transformed', values: t.split('') },
            { label: 'P', values: pDisplay2 },
            { label: 'C', values: [C] },
            { label: 'R', values: [R] },
          ],
          stepDescription: `Expanded P[${i}] to ${P[i]}. Palindrome in original: "${s.substring(palStart, palEnd)}".`,
        });
      }

      // Update C and R if the palindrome around i extends past R
      if (i + P[i] > R) {
        C = i;
        R = i + P[i];
      }

      // Track best palindrome
      if (P[i] > bestRadius) {
        bestRadius = P[i];
        bestCenter = i;
      }
    }

    // Compute final palindrome in original string
    const palStart = Math.floor((bestCenter - bestRadius) / 2);
    const palLength = bestRadius;
    const palindrome = s.substring(palStart, palStart + palLength);

    const textCellsFinal = makeTextCells(s);
    for (let k = palStart; k < palStart + palLength; k++) {
      if (k >= 0 && k < n) {
        textCellsFinal[k] = { char: s[k], color: COLORS.found };
      }
    }

    this.steps.push({
      text: textCellsFinal,
      pattern: makePatternCells(_pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'P', values: P },
        { label: 'Result', values: [palindrome] },
        { label: 'Start', values: [palStart] },
        { label: 'Length', values: [palLength] },
      ],
      stepDescription: `Manacher's algorithm complete. Longest palindrome: "${palindrome}" at index ${palStart} (length ${palLength}).`,
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
