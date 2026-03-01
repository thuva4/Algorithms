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
 * LZ77 Compression Visualization
 *
 * A sliding-window compression algorithm. Maintains a search buffer (already
 * processed text) and a lookahead buffer. At each step, finds the longest
 * match in the search buffer, outputs a (offset, length, next) triple, and
 * advances the window.
 */
export class LZ77CompressionVisualization implements StringVisualizationEngine {
  name = 'LZ77 Compression';
  visualizationType = 'string' as const;

  private steps: StringVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(text: string, _pattern: string): StringVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = text.length;
    const windowSize = Math.min(12, n); // search buffer size
    const lookaheadSize = Math.min(6, n);

    const tokens: { offset: number; length: number; next: string }[] = [];

    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(_pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Window', values: [windowSize] },
        { label: 'Lookahead', values: [lookaheadSize] },
        { label: 'Tokens', values: ['(start)'] },
      ],
      stepDescription: `LZ77 compression: search buffer size=${windowSize}, lookahead buffer size=${lookaheadSize}.`,
    });

    let pos = 0;

    while (pos < n) {
      const searchStart = Math.max(0, pos - windowSize);
      const searchBuf = text.substring(searchStart, pos);
      const lookaheadEnd = Math.min(pos + lookaheadSize, n);
      const lookahead = text.substring(pos, lookaheadEnd);

      // Highlight search buffer and lookahead
      const textCellsBuf = makeTextCells(text);
      for (let k = searchStart; k < pos; k++) {
        textCellsBuf[k] = { char: text[k], color: COLORS.shift };
      }
      for (let k = pos; k < lookaheadEnd; k++) {
        textCellsBuf[k] = { char: text[k], color: COLORS.comparing };
      }

      this.steps.push({
        text: textCellsBuf,
        pattern: makePatternCells(_pattern),
        patternOffset: 0,
        auxiliaryData: [
          { label: 'Search', values: [searchBuf || '(empty)'] },
          { label: 'Lookahead', values: [lookahead] },
          { label: 'Position', values: [pos] },
        ],
        stepDescription: `Position ${pos}: search buffer="${searchBuf || '(empty)'}", lookahead="${lookahead}".`,
      });

      // Find longest match in search buffer
      let bestOffset = 0;
      let bestLength = 0;

      for (let i = searchStart; i < pos; i++) {
        let len = 0;
        // Allow matching beyond search buffer into lookahead (repeating patterns)
        while (pos + len < lookaheadEnd && text[i + len] === text[pos + len]) {
          len++;
        }
        if (len > bestLength) {
          bestLength = len;
          bestOffset = pos - i;
        }
      }

      const nextChar = pos + bestLength < n ? text[pos + bestLength] : '';
      const token = { offset: bestOffset, length: bestLength, next: nextChar };
      tokens.push(token);

      // Highlight the match
      const textCellsMatch = makeTextCells(text);
      if (bestLength > 0) {
        const matchSrc = pos - bestOffset;
        for (let k = 0; k < bestLength; k++) {
          if (matchSrc + k < n) {
            textCellsMatch[matchSrc + k] = { char: text[matchSrc + k], color: COLORS.found };
          }
          textCellsMatch[pos + k] = { char: text[pos + k], color: COLORS.match };
        }
      }
      if (pos + bestLength < n) {
        textCellsMatch[pos + bestLength] = { char: text[pos + bestLength], color: COLORS.comparing };
      }

      const tokenStr = `(${token.offset},${token.length},'${token.next}')`;
      const allTokenStrs = tokens.map(
        (t) => `(${t.offset},${t.length},'${t.next}')`
      );

      this.steps.push({
        text: textCellsMatch,
        pattern: makePatternCells(_pattern),
        patternOffset: 0,
        auxiliaryData: [
          { label: 'Token', values: [tokenStr] },
          { label: 'All Tokens', values: allTokenStrs },
        ],
        stepDescription: bestLength > 0
          ? `Found match at offset ${bestOffset}, length ${bestLength}. Emit token ${tokenStr}. Advance by ${bestLength + 1}.`
          : `No match found. Emit literal token ${tokenStr}. Advance by 1.`,
      });

      pos += bestLength + 1;
    }

    // Final result
    const allTokensFinal = tokens.map(
      (t) => `(${t.offset},${t.length},'${t.next}')`
    );

    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(_pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Tokens', values: allTokensFinal },
        { label: 'Count', values: [tokens.length] },
      ],
      stepDescription: `LZ77 compression complete. ${tokens.length} tokens produced: ${allTokensFinal.join(' ')}.`,
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
