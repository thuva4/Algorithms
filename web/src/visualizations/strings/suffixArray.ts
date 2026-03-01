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
 * Suffix Array Construction Visualization
 *
 * Builds a suffix array by sorting all suffixes of the string lexicographically.
 * Uses a naive O(n^2 log n) approach for clarity, showing each comparison.
 * After building the suffix array, demonstrates pattern search using binary search.
 */
export class SuffixArrayVisualization implements StringVisualizationEngine {
  name = 'Suffix Array';
  visualizationType = 'string' as const;

  private steps: StringVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(text: string, pattern: string): StringVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const s = text + '$'; // append sentinel
    const n = s.length;

    // Generate all suffixes with their starting indices
    const suffixes: { index: number; suffix: string }[] = [];
    for (let i = 0; i < n; i++) {
      suffixes.push({ index: i, suffix: s.substring(i) });
    }

    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Suffixes', values: suffixes.map((s) => `${s.index}:"${s.suffix.length > 10 ? s.suffix.substring(0, 10) + '...' : s.suffix}"`) },
      ],
      stepDescription: `Building suffix array for "${text}$". Generated ${n} suffixes.`,
    });

    // Sort suffixes lexicographically (with visualization of key comparisons)
    // We'll do an insertion sort for clarity with fewer steps
    const sa = suffixes.map((s) => s.index);

    // Simple sort with step recording
    sa.sort((a, b) => {
      const sa_str = s.substring(a);
      const sb_str = s.substring(b);
      if (sa_str < sb_str) return -1;
      if (sa_str > sb_str) return 1;
      return 0;
    });

    // Show sorted suffixes in chunks to avoid too many steps
    const sortedDisplay = sa.map((idx) => {
      const suf = s.substring(idx);
      return `${idx}:"${suf.length > 8 ? suf.substring(0, 8) + '..' : suf}"`;
    });

    const textCellsSorted = makeTextCells(text);
    this.steps.push({
      text: textCellsSorted,
      pattern: makePatternCells(pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'SA', values: sa },
        { label: 'Sorted', values: sortedDisplay },
      ],
      stepDescription: `Suffix array built: [${sa.join(', ')}]. Suffixes sorted lexicographically.`,
    });

    // ── Phase 2: Search for pattern using binary search on suffix array ──
    if (pattern.length > 0) {
      this.steps.push({
        text: makeTextCells(text),
        pattern: makePatternCells(pattern),
        patternOffset: 0,
        auxiliaryData: [
          { label: 'SA', values: sa },
          { label: 'Search', values: [pattern] },
        ],
        stepDescription: `Searching for pattern "${pattern}" using binary search on the suffix array.`,
      });

      let lo = 0;
      let hi = n - 1;
      let found = -1;

      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        const suffix = s.substring(sa[mid]);
        const cmpLen = Math.min(pattern.length, suffix.length);
        const cmpStr = suffix.substring(0, cmpLen);

        const textCellsBin = makeTextCells(text);
        // Highlight the suffix being compared
        for (let k = sa[mid]; k < Math.min(sa[mid] + pattern.length, text.length); k++) {
          textCellsBin[k] = { char: text[k], color: COLORS.comparing };
        }

        const cmpResult = cmpStr < pattern ? -1 : cmpStr > pattern ? 1 : 0;

        this.steps.push({
          text: textCellsBin,
          pattern: makePatternCells(pattern),
          patternOffset: sa[mid] < text.length ? sa[mid] : 0,
          auxiliaryData: [
            { label: 'lo', values: [lo] },
            { label: 'mid', values: [mid] },
            { label: 'hi', values: [hi] },
            { label: 'SA[mid]', values: [sa[mid]] },
            { label: 'Suffix', values: [`"${cmpStr}"`] },
          ],
          stepDescription: `Binary search: lo=${lo}, mid=${mid}, hi=${hi}. SA[${mid}]=${sa[mid]}, comparing "${cmpStr}" with "${pattern}".`,
        });

        if (cmpResult === 0) {
          found = sa[mid];

          const textCellsFound = makeTextCells(text);
          for (let k = sa[mid]; k < Math.min(sa[mid] + pattern.length, text.length); k++) {
            textCellsFound[k] = { char: text[k], color: COLORS.found };
          }
          const patCellsFound = makePatternCells(pattern);
          for (let k = 0; k < pattern.length; k++) {
            patCellsFound[k] = { char: pattern[k], color: COLORS.found };
          }

          this.steps.push({
            text: textCellsFound,
            pattern: patCellsFound,
            patternOffset: sa[mid] < text.length ? sa[mid] : 0,
            auxiliaryData: [
              { label: 'SA', values: sa },
              { label: 'Found', values: [`index ${sa[mid]}`] },
            ],
            stepDescription: `Pattern "${pattern}" found at index ${sa[mid]} via suffix array!`,
          });
          break;
        } else if (cmpResult < 0) {
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }

      if (found === -1) {
        this.steps.push({
          text: makeTextCells(text),
          pattern: makePatternCells(pattern),
          patternOffset: 0,
          auxiliaryData: [
            { label: 'SA', values: sa },
          ],
          stepDescription: `Pattern "${pattern}" not found in the suffix array.`,
        });
      }
    }

    // Final step
    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'SA', values: sa },
      ],
      stepDescription: `Suffix array construction and search complete. SA = [${sa.join(', ')}].`,
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
