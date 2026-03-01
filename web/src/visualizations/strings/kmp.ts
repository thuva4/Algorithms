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

export class KMPVisualization implements StringVisualizationEngine {
  name = 'Knuth-Morris-Pratt';
  visualizationType = 'string' as const;

  private steps: StringVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(text: string, pattern: string): StringVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = text.length;
    const m = pattern.length;

    // ── Phase 1: Build the failure function (prefix table) ───────────
    const failure: number[] = new Array(m).fill(0);

    // Initial step: show the pattern and empty failure function
    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Failure', values: failure.map(() => '-') },
      ],
      stepDescription: 'Building the failure function (prefix table) for the pattern.',
    });

    // failure[0] is always 0
    const failureDisplay: (number | string)[] = new Array(m).fill('-');
    failureDisplay[0] = 0;

    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Failure', values: [...failureDisplay] },
      ],
      stepDescription: 'failure[0] = 0 (first character always has failure value 0).',
    });

    let k = 0; // length of previous longest prefix suffix
    let i = 1;

    while (i < m) {
      const patCells = makePatternCells(pattern);
      // Highlight the characters being compared in the failure computation
      patCells[i] = { char: pattern[i], color: COLORS.comparing };
      if (k > 0) {
        patCells[k] = { char: pattern[k], color: COLORS.comparing };
      }

      if (pattern[i] === pattern[k]) {
        k++;
        failure[i] = k;
        failureDisplay[i] = k;

        const patCellsAfter = makePatternCells(pattern);
        patCellsAfter[i] = { char: pattern[i], color: COLORS.match };
        patCellsAfter[k - 1] = { char: pattern[k - 1], color: COLORS.match };

        this.steps.push({
          text: makeTextCells(text),
          pattern: patCellsAfter,
          patternOffset: 0,
          auxiliaryData: [
            { label: 'Failure', values: [...failureDisplay] },
          ],
          stepDescription: `pattern[${i}]='${pattern[i]}' matches pattern[${k - 1}]='${pattern[k - 1]}'. failure[${i}] = ${k}.`,
        });

        i++;
      } else {
        if (k !== 0) {
          this.steps.push({
            text: makeTextCells(text),
            pattern: patCells,
            patternOffset: 0,
            auxiliaryData: [
              { label: 'Failure', values: [...failureDisplay] },
            ],
            stepDescription: `pattern[${i}]='${pattern[i]}' != pattern[${k}]='${pattern[k]}'. Fall back: k = failure[${k - 1}] = ${failure[k - 1]}.`,
          });
          k = failure[k - 1];
        } else {
          failure[i] = 0;
          failureDisplay[i] = 0;

          this.steps.push({
            text: makeTextCells(text),
            pattern: patCells,
            patternOffset: 0,
            auxiliaryData: [
              { label: 'Failure', values: [...failureDisplay] },
            ],
            stepDescription: `pattern[${i}]='${pattern[i]}' != pattern[0]='${pattern[0]}'. No prefix match, failure[${i}] = 0.`,
          });

          i++;
        }
      }
    }

    // Show completed failure function
    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Failure', values: failure.map((v) => v) },
      ],
      stepDescription: `Failure function complete: [${failure.join(', ')}]. Starting pattern matching.`,
    });

    // ── Phase 2: KMP Search ──────────────────────────────────────────
    let ti = 0; // text index
    let pi = 0; // pattern index
    let matchFound = false;

    while (ti < n) {
      const textCells = makeTextCells(text);
      const patCells = makePatternCells(pattern);
      const offset = ti - pi;

      // Highlight the comparing characters
      textCells[ti] = { char: text[ti], color: COLORS.comparing };
      patCells[pi] = { char: pattern[pi], color: COLORS.comparing };

      this.steps.push({
        text: textCells,
        pattern: patCells,
        patternOffset: offset,
        auxiliaryData: [
          { label: 'Failure', values: failure.map((v) => v) },
        ],
        stepDescription: `Comparing text[${ti}]='${text[ti]}' with pattern[${pi}]='${pattern[pi]}'.`,
      });

      if (text[ti] === pattern[pi]) {
        // Match at this position
        const textCellsMatch = makeTextCells(text);
        const patCellsMatch = makePatternCells(pattern);

        // Highlight all previously matched + current
        for (let x = 0; x <= pi; x++) {
          textCellsMatch[offset + x] = { char: text[offset + x], color: COLORS.match };
          patCellsMatch[x] = { char: pattern[x], color: COLORS.match };
        }

        this.steps.push({
          text: textCellsMatch,
          pattern: patCellsMatch,
          patternOffset: offset,
          auxiliaryData: [
            { label: 'Failure', values: failure.map((v) => v) },
          ],
          stepDescription: `Match! text[${ti}]='${text[ti]}' == pattern[${pi}]='${pattern[pi]}'.`,
        });

        ti++;
        pi++;

        if (pi === m) {
          // Full pattern match found
          matchFound = true;
          const textCellsFound = makeTextCells(text);
          const patCellsFound = makePatternCells(pattern);

          for (let x = 0; x < m; x++) {
            textCellsFound[offset + x] = { char: text[offset + x], color: COLORS.found };
            patCellsFound[x] = { char: pattern[x], color: COLORS.found };
          }

          this.steps.push({
            text: textCellsFound,
            pattern: patCellsFound,
            patternOffset: offset,
            auxiliaryData: [
              { label: 'Failure', values: failure.map((v) => v) },
            ],
            stepDescription: `Pattern found at index ${offset}!`,
          });

          // Continue searching using failure function
          pi = failure[pi - 1];
        }
      } else {
        // Mismatch
        const textCellsMiss = makeTextCells(text);
        const patCellsMiss = makePatternCells(pattern);
        textCellsMiss[ti] = { char: text[ti], color: COLORS.mismatch };
        patCellsMiss[pi] = { char: pattern[pi], color: COLORS.mismatch };

        if (pi !== 0) {
          const newPi = failure[pi - 1];
          const newOffset = ti - newPi;

          this.steps.push({
            text: textCellsMiss,
            pattern: patCellsMiss,
            patternOffset: offset,
            auxiliaryData: [
              { label: 'Failure', values: failure.map((v) => v) },
            ],
            stepDescription: `Mismatch! text[${ti}]='${text[ti]}' != pattern[${pi}]='${pattern[pi]}'. Use failure[${pi - 1}]=${newPi}, shift pattern to offset ${newOffset}.`,
          });

          // Show the shift
          const patCellsShift = makePatternCells(pattern);
          patCellsShift[newPi] = { char: pattern[newPi], color: COLORS.shift };

          this.steps.push({
            text: makeTextCells(text),
            pattern: patCellsShift,
            patternOffset: newOffset,
            auxiliaryData: [
              { label: 'Failure', values: failure.map((v) => v) },
            ],
            stepDescription: `Pattern shifted to offset ${newOffset}. Resume comparison at pattern[${newPi}].`,
          });

          pi = newPi;
        } else {
          this.steps.push({
            text: textCellsMiss,
            pattern: patCellsMiss,
            patternOffset: offset,
            auxiliaryData: [
              { label: 'Failure', values: failure.map((v) => v) },
            ],
            stepDescription: `Mismatch at pattern start. Advance text index to ${ti + 1}.`,
          });

          ti++;

          if (ti < n) {
            this.steps.push({
              text: makeTextCells(text),
              pattern: makePatternCells(pattern),
              patternOffset: ti,
              auxiliaryData: [
                { label: 'Failure', values: failure.map((v) => v) },
              ],
              stepDescription: `Pattern shifted to offset ${ti}.`,
            });
          }
        }
      }
    }

    // Final step
    const finalText = makeTextCells(text);
    this.steps.push({
      text: finalText,
      pattern: makePatternCells(pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Failure', values: failure.map((v) => v) },
      ],
      stepDescription: matchFound
        ? 'KMP search complete. Pattern was found in the text.'
        : 'KMP search complete. Pattern was not found in the text.',
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
