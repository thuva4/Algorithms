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
 * Run-Length Encoding (RLE) Visualization
 *
 * Compresses a string by replacing consecutive runs of the same character
 * with the character followed by its count. For example, "AAABBC" -> "A3B2C1".
 * The text parameter is the input string to encode.
 */
export class RunLengthEncodingVisualization implements StringVisualizationEngine {
  name = 'Run-Length Encoding';
  visualizationType = 'string' as const;

  private steps: StringVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(text: string, _pattern: string): StringVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = text.length;
    const encoded: { char: string; count: number }[] = [];
    let encodedStr = '';

    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(_pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Encoded', values: ['(start)'] },
      ],
      stepDescription: `Run-Length Encoding: scanning "${text}" for consecutive character runs.`,
    });

    let i = 0;
    while (i < n) {
      const currentChar = text[i];
      let count = 1;
      const runStart = i;

      // Show the start of a new run
      const textCellsStart = makeTextCells(text);
      textCellsStart[i] = { char: text[i], color: COLORS.comparing };

      this.steps.push({
        text: textCellsStart,
        pattern: makePatternCells(_pattern),
        patternOffset: 0,
        auxiliaryData: [
          { label: 'Encoded', values: [encodedStr || '(empty)'] },
          { label: 'Current', values: [`'${currentChar}'`] },
          { label: 'Count', values: [count] },
        ],
        stepDescription: `Starting new run at index ${i} with character '${currentChar}'.`,
      });

      // Count consecutive characters
      while (i + count < n && text[i + count] === currentChar) {
        count++;

        const textCellsRun = makeTextCells(text);
        for (let k = runStart; k < runStart + count; k++) {
          textCellsRun[k] = { char: text[k], color: COLORS.match };
        }
        // Highlight the next char being checked if exists
        if (i + count < n) {
          textCellsRun[i + count] = { char: text[i + count], color: COLORS.comparing };
        }

        this.steps.push({
          text: textCellsRun,
          pattern: makePatternCells(_pattern),
          patternOffset: 0,
          auxiliaryData: [
            { label: 'Encoded', values: [encodedStr || '(empty)'] },
            { label: 'Current', values: [`'${currentChar}'`] },
            { label: 'Count', values: [count] },
          ],
          stepDescription: `text[${runStart + count - 1}]='${currentChar}' continues the run. Count = ${count}.`,
        });
      }

      // Check if the run ends due to a different character or end of string
      if (i + count < n) {
        const textCellsEnd = makeTextCells(text);
        for (let k = runStart; k < runStart + count; k++) {
          textCellsEnd[k] = { char: text[k], color: COLORS.match };
        }
        textCellsEnd[i + count] = { char: text[i + count], color: COLORS.mismatch };

        this.steps.push({
          text: textCellsEnd,
          pattern: makePatternCells(_pattern),
          patternOffset: 0,
          auxiliaryData: [
            { label: 'Encoded', values: [encodedStr || '(empty)'] },
            { label: 'Current', values: [`'${currentChar}'`] },
            { label: 'Count', values: [count] },
          ],
          stepDescription: `text[${i + count}]='${text[i + count]}' != '${currentChar}'. Run ends with count ${count}.`,
        });
      }

      // Emit the encoding for this run
      encoded.push({ char: currentChar, count });
      encodedStr += `${currentChar}${count}`;

      const textCellsEmit = makeTextCells(text);
      for (let k = runStart; k < runStart + count; k++) {
        textCellsEmit[k] = { char: text[k], color: COLORS.found };
      }

      this.steps.push({
        text: textCellsEmit,
        pattern: makePatternCells(_pattern),
        patternOffset: 0,
        auxiliaryData: [
          { label: 'Encoded', values: [encodedStr] },
          { label: 'Emitted', values: [`${currentChar}${count}`] },
        ],
        stepDescription: `Emit "${currentChar}${count}". Encoded so far: "${encodedStr}".`,
      });

      i += count;
    }

    // Final result
    const ratio = n > 0 ? ((encodedStr.length / n) * 100).toFixed(1) : '0';

    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(_pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Result', values: [encodedStr] },
        { label: 'Original', values: [n] },
        { label: 'Encoded', values: [encodedStr.length] },
        { label: 'Ratio', values: [`${ratio}%`] },
      ],
      stepDescription: `RLE complete. "${text}" -> "${encodedStr}" (${encodedStr.length}/${n} chars, ${ratio}%).`,
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
