import type { StringVisualizationEngine, StringVisualizationState, CharCell } from '../types';

const COLORS = {
  default: '#e5e7eb',
  comparing: '#fbbf24',
  match: '#34d399',
  mismatch: '#f87171',
  found: '#60a5fa',
  shift: '#a855f7',
};

const BASE = 31;
const MOD = 1000000007;

function makeTextCells(text: string): CharCell[] {
  return text.split('').map((char) => ({ char, color: COLORS.default }));
}

function makePatternCells(pattern: string): CharCell[] {
  return pattern.split('').map((char) => ({ char, color: COLORS.default }));
}

/**
 * Robin-Karp Rolling Hash Visualization
 *
 * A variant of Rabin-Karp that focuses on the rolling hash mechanism.
 * Uses a polynomial rolling hash: h = sum(s[i] * base^(m-1-i)) mod MOD.
 * The hash is updated in O(1) by removing the leftmost character contribution
 * and adding the new rightmost character.
 */
export class RobinKarpRollingHashVisualization implements StringVisualizationEngine {
  name = 'Robin-Karp Rolling Hash';
  visualizationType = 'string' as const;

  private steps: StringVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(text: string, pattern: string): StringVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = text.length;
    const m = pattern.length;

    // Compute base^(m-1) mod MOD
    let highPow = 1;
    for (let i = 0; i < m - 1; i++) {
      highPow = (highPow * BASE) % MOD;
    }

    // Hash function: polynomial rolling hash
    const charVal = (c: string): number => c.charCodeAt(0) - 'A'.charCodeAt(0) + 1;

    // Compute pattern hash
    let patHash = 0;
    for (let i = 0; i < m; i++) {
      patHash = (patHash * BASE + charVal(pattern[i])) % MOD;
    }

    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Pat Hash', values: [patHash] },
        { label: 'Base', values: [BASE] },
        { label: 'Mod', values: [MOD] },
      ],
      stepDescription: `Rolling hash: base=${BASE}, mod=${MOD}. Pattern hash = ${patHash}.`,
    });

    // Compute initial window hash
    let winHash = 0;
    for (let i = 0; i < m; i++) {
      winHash = (winHash * BASE + charVal(text[i])) % MOD;
    }

    const textCellsInit = makeTextCells(text);
    for (let i = 0; i < m; i++) {
      textCellsInit[i] = { char: text[i], color: COLORS.comparing };
    }

    this.steps.push({
      text: textCellsInit,
      pattern: makePatternCells(pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Pat Hash', values: [patHash] },
        { label: 'Win Hash', values: [winHash] },
      ],
      stepDescription: `Initial window hash for "${text.substring(0, m)}" = ${winHash}.`,
    });

    // ── Slide the window ─────────────────────────────────────────────
    let matchFound = false;

    for (let s = 0; s <= n - m; s++) {
      const hashMatch = winHash === patHash;

      // Show current window
      const textCellsWin = makeTextCells(text);
      for (let j = s; j < s + m; j++) {
        textCellsWin[j] = { char: text[j], color: hashMatch ? COLORS.match : COLORS.comparing };
      }

      this.steps.push({
        text: textCellsWin,
        pattern: makePatternCells(pattern),
        patternOffset: s,
        auxiliaryData: [
          { label: 'Pat Hash', values: [patHash] },
          { label: 'Win Hash', values: [winHash] },
        ],
        stepDescription: hashMatch
          ? `Offset ${s}: winHash=${winHash} == patHash=${patHash}. Verifying...`
          : `Offset ${s}: winHash=${winHash} != patHash=${patHash}. No match.`,
      });

      if (hashMatch) {
        // Verify character by character
        let verified = true;
        for (let j = 0; j < m; j++) {
          if (text[s + j] !== pattern[j]) {
            verified = false;

            const textCellsMiss = makeTextCells(text);
            const patCellsMiss = makePatternCells(pattern);
            for (let k = 0; k < j; k++) {
              textCellsMiss[s + k] = { char: text[s + k], color: COLORS.match };
              patCellsMiss[k] = { char: pattern[k], color: COLORS.match };
            }
            textCellsMiss[s + j] = { char: text[s + j], color: COLORS.mismatch };
            patCellsMiss[j] = { char: pattern[j], color: COLORS.mismatch };

            this.steps.push({
              text: textCellsMiss,
              pattern: patCellsMiss,
              patternOffset: s,
              auxiliaryData: [
                { label: 'Pat Hash', values: [patHash] },
                { label: 'Win Hash', values: [winHash] },
              ],
              stepDescription: `Spurious hit! text[${s + j}]='${text[s + j]}' != pattern[${j}]='${pattern[j]}'.`,
            });
            break;
          }
        }

        if (verified) {
          matchFound = true;
          const textCellsFound = makeTextCells(text);
          const patCellsFound = makePatternCells(pattern);
          for (let j = 0; j < m; j++) {
            textCellsFound[s + j] = { char: text[s + j], color: COLORS.found };
            patCellsFound[j] = { char: pattern[j], color: COLORS.found };
          }

          this.steps.push({
            text: textCellsFound,
            pattern: patCellsFound,
            patternOffset: s,
            auxiliaryData: [
              { label: 'Pat Hash', values: [patHash] },
              { label: 'Win Hash', values: [winHash] },
            ],
            stepDescription: `Pattern found at index ${s}!`,
          });
        }
      }

      // Rolling hash update
      if (s < n - m) {
        const oldHash = winHash;
        // Remove leftmost char, add new rightmost char
        winHash = (winHash - charVal(text[s]) * highPow % MOD + MOD) % MOD;
        winHash = (winHash * BASE + charVal(text[s + m])) % MOD;

        const textCellsRoll = makeTextCells(text);
        textCellsRoll[s] = { char: text[s], color: COLORS.mismatch };
        textCellsRoll[s + m] = { char: text[s + m], color: COLORS.shift };

        this.steps.push({
          text: textCellsRoll,
          pattern: makePatternCells(pattern),
          patternOffset: s + 1,
          auxiliaryData: [
            { label: 'Pat Hash', values: [patHash] },
            { label: 'Win Hash', values: [`${oldHash} -> ${winHash}`] },
          ],
          stepDescription: `Roll hash: remove '${text[s]}', add '${text[s + m]}'. Hash: ${oldHash} -> ${winHash}.`,
        });
      }
    }

    // Final step
    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Pat Hash', values: [patHash] },
      ],
      stepDescription: matchFound
        ? 'Robin-Karp rolling hash search complete. Pattern was found.'
        : 'Robin-Karp rolling hash search complete. Pattern was not found.',
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
