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
 * Bitap (Shift-Or) Algorithm Visualization
 *
 * Uses bitmasks to track matching state. For each character in the alphabet,
 * a bitmask encodes where that character appears in the pattern. A running
 * state bitmask R is updated per text character with shift + OR.
 */
export class BitapAlgorithmVisualization implements StringVisualizationEngine {
  name = 'Bitap Algorithm';
  visualizationType = 'string' as const;

  private steps: StringVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(text: string, pattern: string): StringVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = text.length;
    const m = pattern.length;

    // ── Phase 1: Build character bitmasks ────────────────────────────
    // mask[c] has bit i set to 0 if pattern[i] === c, else 1
    const mask: Record<string, number> = {};
    const allOnes = (1 << m) - 1; // m bits all set to 1

    // Initialize masks for all chars in text + pattern
    const allChars = new Set([...text, ...pattern]);
    for (const c of allChars) {
      mask[c] = allOnes;
    }

    // Clear bits where pattern has matching characters
    for (let i = 0; i < m; i++) {
      mask[pattern[i]] &= ~(1 << i);
    }

    // Format a number as a binary string of length m (LSB on right)
    const toBin = (v: number): string => {
      let s = '';
      for (let i = m - 1; i >= 0; i--) {
        s += (v >> i) & 1 ? '1' : '0';
      }
      return s;
    };

    // Show mask table
    const maskEntries: (number | string)[] = [];
    const uniquePatChars = [...new Set(pattern.split(''))];
    for (const c of uniquePatChars) {
      maskEntries.push(`${c}:${toBin(mask[c])}`);
    }

    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Masks', values: maskEntries },
        { label: 'R', values: [toBin(allOnes)] },
      ],
      stepDescription: `Precomputed bitmasks for pattern characters (0=match, 1=no match). Pattern length m=${m}.`,
    });

    // ── Phase 2: Search ──────────────────────────────────────────────
    let R = allOnes; // all bits set — no matches
    let matchFound = false;

    for (let i = 0; i < n; i++) {
      const ch = text[i];
      const prevR = R;

      // Shift-Or update: R = (R << 1) | mask[ch]
      const charMask = mask[ch] !== undefined ? mask[ch] : allOnes;
      R = ((R << 1) | charMask) & allOnes;

      const textCells = makeTextCells(text);
      const patCells = makePatternCells(pattern);
      textCells[i] = { char: ch, color: COLORS.comparing };

      this.steps.push({
        text: textCells,
        pattern: patCells,
        patternOffset: Math.max(0, i - m + 1),
        auxiliaryData: [
          { label: 'Masks', values: maskEntries },
          { label: 'R', values: [`${toBin(prevR)} -> ${toBin(R)}`] },
          { label: 'Char', values: [ch] },
        ],
        stepDescription: `Read text[${i}]='${ch}'. R = (${toBin(prevR)} << 1) | mask['${ch}'] = ${toBin(R)}.`,
      });

      // Check if bit (m-1) is 0 — match found
      if ((R & (1 << (m - 1))) === 0) {
        matchFound = true;
        const matchStart = i - m + 1;

        const textCellsFound = makeTextCells(text);
        const patCellsFound = makePatternCells(pattern);
        for (let j = 0; j < m; j++) {
          textCellsFound[matchStart + j] = { char: text[matchStart + j], color: COLORS.found };
          patCellsFound[j] = { char: pattern[j], color: COLORS.found };
        }

        this.steps.push({
          text: textCellsFound,
          pattern: patCellsFound,
          patternOffset: matchStart,
          auxiliaryData: [
            { label: 'Masks', values: maskEntries },
            { label: 'R', values: [toBin(R)] },
          ],
          stepDescription: `Bit ${m - 1} of R is 0 — pattern found at index ${matchStart}!`,
        });
      }
    }

    // Final step
    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Masks', values: maskEntries },
      ],
      stepDescription: matchFound
        ? 'Bitap search complete. Pattern was found in the text.'
        : 'Bitap search complete. Pattern was not found in the text.',
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
