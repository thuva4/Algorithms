import type { StringVisualizationEngine, StringVisualizationState, CharCell } from '../types';

const COLORS = {
  default: '#e5e7eb',
  comparing: '#fbbf24',
  match: '#34d399',
  mismatch: '#f87171',
  found: '#60a5fa',
  shift: '#a855f7',
};

const BASE = 256;
const MOD = 101;

function makeTextCells(text: string): CharCell[] {
  return text.split('').map((char) => ({ char, color: COLORS.default }));
}

function makePatternCells(pattern: string): CharCell[] {
  return pattern.split('').map((char) => ({ char, color: COLORS.default }));
}

function computeHash(s: string, len: number): number {
  let h = 0;
  for (let i = 0; i < len; i++) {
    h = (h * BASE + s.charCodeAt(i)) % MOD;
  }
  return h;
}

export class RabinKarpVisualization implements StringVisualizationEngine {
  name = 'Rabin-Karp';
  visualizationType = 'string' as const;

  private steps: StringVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(text: string, pattern: string): StringVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = text.length;
    const m = pattern.length;

    // Compute h = BASE^(m-1) % MOD for rolling hash removal
    let h = 1;
    for (let i = 0; i < m - 1; i++) {
      h = (h * BASE) % MOD;
    }

    // ── Phase 1: Compute pattern hash ────────────────────────────────
    const patternHash = computeHash(pattern, m);

    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Pat Hash', values: [patternHash] },
        { label: 'Win Hash', values: ['-'] },
      ],
      stepDescription: `Pattern hash computed: hash("${pattern}") = ${patternHash} (base=${BASE}, mod=${MOD}).`,
    });

    // ── Phase 2: Compute initial window hash ─────────────────────────
    let windowHash = computeHash(text, m);

    const textCellsInit = makeTextCells(text);
    for (let i = 0; i < m; i++) {
      textCellsInit[i] = { char: text[i], color: COLORS.comparing };
    }

    this.steps.push({
      text: textCellsInit,
      pattern: makePatternCells(pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Pat Hash', values: [patternHash] },
        { label: 'Win Hash', values: [windowHash] },
      ],
      stepDescription: `Initial window hash: hash("${text.substring(0, m)}") = ${windowHash}.`,
    });

    // ── Phase 3: Slide the window ────────────────────────────────────
    let matchFound = false;

    for (let s = 0; s <= n - m; s++) {
      // Show current window
      const textCellsWindow = makeTextCells(text);
      for (let j = s; j < s + m; j++) {
        textCellsWindow[j] = { char: text[j], color: COLORS.comparing };
      }

      const hashMatch = windowHash === patternHash;

      this.steps.push({
        text: textCellsWindow,
        pattern: makePatternCells(pattern),
        patternOffset: s,
        auxiliaryData: [
          { label: 'Pat Hash', values: [patternHash] },
          { label: 'Win Hash', values: [windowHash] },
        ],
        stepDescription: hashMatch
          ? `Window at offset ${s}: hash=${windowHash} matches pattern hash=${patternHash}. Verifying characters...`
          : `Window at offset ${s}: hash=${windowHash} != pattern hash=${patternHash}. No match, slide window.`,
      });

      if (hashMatch) {
        // Verify character by character
        let verified = true;
        for (let j = 0; j < m; j++) {
          const textCellsVerify = makeTextCells(text);
          const patCellsVerify = makePatternCells(pattern);

          // Show previously verified characters as green
          for (let k = 0; k < j; k++) {
            textCellsVerify[s + k] = { char: text[s + k], color: COLORS.match };
            patCellsVerify[k] = { char: pattern[k], color: COLORS.match };
          }

          // Current comparison
          textCellsVerify[s + j] = { char: text[s + j], color: COLORS.comparing };
          patCellsVerify[j] = { char: pattern[j], color: COLORS.comparing };

          this.steps.push({
            text: textCellsVerify,
            pattern: patCellsVerify,
            patternOffset: s,
            auxiliaryData: [
              { label: 'Pat Hash', values: [patternHash] },
              { label: 'Win Hash', values: [windowHash] },
            ],
            stepDescription: `Verifying: text[${s + j}]='${text[s + j]}' vs pattern[${j}]='${pattern[j]}'.`,
          });

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
                { label: 'Pat Hash', values: [patternHash] },
                { label: 'Win Hash', values: [windowHash] },
              ],
              stepDescription: `Spurious hit! text[${s + j}]='${text[s + j]}' != pattern[${j}]='${pattern[j]}'. Hash matched but characters differ.`,
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
              { label: 'Pat Hash', values: [patternHash] },
              { label: 'Win Hash', values: [windowHash] },
            ],
            stepDescription: `Pattern found at index ${s}!`,
          });
        }
      }

      // Compute rolling hash for next window
      if (s < n - m) {
        const oldHash = windowHash;
        windowHash = (BASE * (windowHash - text.charCodeAt(s) * h) + text.charCodeAt(s + m)) % MOD;
        if (windowHash < 0) {
          windowHash += MOD;
        }

        const textCellsRoll = makeTextCells(text);
        textCellsRoll[s] = { char: text[s], color: COLORS.mismatch }; // removed char
        textCellsRoll[s + m] = { char: text[s + m], color: COLORS.shift }; // added char

        this.steps.push({
          text: textCellsRoll,
          pattern: makePatternCells(pattern),
          patternOffset: s + 1,
          auxiliaryData: [
            { label: 'Pat Hash', values: [patternHash] },
            { label: 'Win Hash', values: [`${oldHash} -> ${windowHash}`] },
          ],
          stepDescription: `Rolling hash: remove '${text[s]}', add '${text[s + m]}'. New hash = ${windowHash}.`,
        });
      }
    }

    // Final step
    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Pat Hash', values: [patternHash] },
      ],
      stepDescription: matchFound
        ? 'Rabin-Karp search complete. Pattern was found in the text.'
        : 'Rabin-Karp search complete. Pattern was not found in the text.',
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
