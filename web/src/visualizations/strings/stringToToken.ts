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
 * String to Token (BPE-style Tokenization) Visualization
 *
 * Demonstrates a simplified Byte-Pair Encoding tokenizer that:
 * 1. Starts by splitting the text into individual characters
 * 2. Iteratively finds the most common adjacent pair
 * 3. Merges that pair into a single token
 * 4. Repeats until no pair occurs more than once
 *
 * Visualizes each merge step with the resulting token list.
 */
export class StringToTokenVisualization implements StringVisualizationEngine {
  name = 'String to Token';
  visualizationType = 'string' as const;

  private steps: StringVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(text: string, _pattern: string): StringVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Start with character-level tokens
    let tokens: string[] = text.split('');

    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(_pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Tokens', values: tokens.map((t) => `"${t}"`) },
        { label: 'Count', values: [tokens.length] },
      ],
      stepDescription: `Initial tokenization: split into ${tokens.length} character tokens.`,
    });

    const mergeHistory: string[] = [];
    let iteration = 0;
    const maxIterations = 20; // safety limit

    while (iteration < maxIterations) {
      iteration++;

      // Count all adjacent pairs
      const pairCounts = new Map<string, number>();
      for (let i = 0; i < tokens.length - 1; i++) {
        const pair = tokens[i] + '|' + tokens[i + 1];
        pairCounts.set(pair, (pairCounts.get(pair) || 0) + 1);
      }

      // Find the most frequent pair
      let bestPair = '';
      let bestCount = 0;
      for (const [pair, count] of pairCounts) {
        if (count > bestCount) {
          bestCount = count;
          bestPair = pair;
        }
      }

      // Stop if no pair occurs more than once
      if (bestCount <= 1) {
        this.steps.push({
          text: makeTextCells(text),
          pattern: makePatternCells(_pattern),
          patternOffset: 0,
          auxiliaryData: [
            { label: 'Tokens', values: tokens.map((t) => `"${t}"`) },
            { label: 'Status', values: ['No pair with count > 1'] },
          ],
          stepDescription: `No adjacent pair occurs more than once. Merge phase complete.`,
        });
        break;
      }

      const [left, right] = bestPair.split('|');
      const merged = left + right;
      mergeHistory.push(`${left}+${right}->${merged}`);

      // Show the pair being merged
      const textCellsMerge = makeTextCells(text);
      // Highlight positions in original text where merges happen
      let origPos = 0;
      for (let i = 0; i < tokens.length; i++) {
        if (i < tokens.length - 1 && tokens[i] === left && tokens[i + 1] === right) {
          for (let k = 0; k < tokens[i].length + tokens[i + 1].length; k++) {
            if (origPos + k < text.length) {
              textCellsMerge[origPos + k] = { char: text[origPos + k], color: COLORS.match };
            }
          }
        }
        origPos += tokens[i].length;
      }

      this.steps.push({
        text: textCellsMerge,
        pattern: makePatternCells(_pattern),
        patternOffset: 0,
        auxiliaryData: [
          { label: 'Merge', values: [`"${left}" + "${right}" -> "${merged}" (x${bestCount})`] },
          { label: 'Tokens', values: tokens.map((t) => `"${t}"`) },
        ],
        stepDescription: `Merge #${iteration}: "${left}" + "${right}" -> "${merged}" (appears ${bestCount} times).`,
      });

      // Perform the merge
      const newTokens: string[] = [];
      let i = 0;
      while (i < tokens.length) {
        if (i < tokens.length - 1 && tokens[i] === left && tokens[i + 1] === right) {
          newTokens.push(merged);
          i += 2;
        } else {
          newTokens.push(tokens[i]);
          i++;
        }
      }
      tokens = newTokens;

      // Show result after merge
      const textCellsAfter = makeTextCells(text);
      origPos = 0;
      for (const token of tokens) {
        const color = token === merged ? COLORS.found : COLORS.default;
        for (let k = 0; k < token.length; k++) {
          if (origPos + k < text.length) {
            textCellsAfter[origPos + k] = { char: text[origPos + k], color };
          }
        }
        origPos += token.length;
      }

      this.steps.push({
        text: textCellsAfter,
        pattern: makePatternCells(_pattern),
        patternOffset: 0,
        auxiliaryData: [
          { label: 'Tokens', values: tokens.map((t) => `"${t}"`) },
          { label: 'Count', values: [tokens.length] },
        ],
        stepDescription: `After merge: ${tokens.length} tokens: [${tokens.map((t) => `"${t}"`).join(', ')}].`,
      });
    }

    // Final result
    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(_pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Final Tokens', values: tokens.map((t) => `"${t}"`) },
        { label: 'Merges', values: mergeHistory.length > 0 ? mergeHistory : ['none'] },
        { label: 'Token Count', values: [tokens.length] },
      ],
      stepDescription: `Tokenization complete. ${tokens.length} final tokens after ${mergeHistory.length} merges.`,
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
