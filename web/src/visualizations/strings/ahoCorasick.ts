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

interface TrieNode {
  children: Map<string, number>;
  fail: number;
  output: string[];
  depth: number;
}

export class AhoCorasickVisualization implements StringVisualizationEngine {
  name = 'Aho-Corasick';
  visualizationType = 'string' as const;

  private steps: StringVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(text: string, pattern: string): StringVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Split comma-separated patterns
    const patterns = pattern.split(',').map((p) => p.trim()).filter((p) => p.length > 0);
    const displayPattern = patterns.join(', ');

    // ── Phase 1: Build Trie ──────────────────────────────────────────
    const trie: TrieNode[] = [{ children: new Map(), fail: 0, output: [], depth: 0 }];

    // Show initial state
    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(displayPattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Patterns', values: patterns },
        { label: 'Trie', values: ['root'] },
      ],
      stepDescription: `Building Aho-Corasick automaton for patterns: [${patterns.map((p) => `"${p}"`).join(', ')}].`,
    });

    // Insert each pattern into the trie
    for (const pat of patterns) {
      let current = 0;
      const triePathLabels: string[] = ['root'];

      for (let i = 0; i < pat.length; i++) {
        const ch = pat[i];
        if (!trie[current].children.has(ch)) {
          trie.push({ children: new Map(), fail: 0, output: [], depth: trie[current].depth + 1 });
          trie[current].children.set(ch, trie.length - 1);
        }
        current = trie[current].children.get(ch)!;
        triePathLabels.push(ch);
      }
      trie[current].output.push(pat);

      this.steps.push({
        text: makeTextCells(text),
        pattern: makePatternCells(displayPattern),
        patternOffset: 0,
        auxiliaryData: [
          { label: 'Patterns', values: patterns },
          { label: 'Insert', values: triePathLabels },
          { label: 'Nodes', values: [trie.length] },
        ],
        stepDescription: `Inserted "${pat}" into trie. Path: ${triePathLabels.join(' -> ')}. Trie now has ${trie.length} nodes.`,
      });
    }

    // ── Phase 2: Build Failure Links (BFS) ───────────────────────────
    const queue: number[] = [];

    // Initialize failure links for depth-1 nodes
    for (const [, childIdx] of trie[0].children) {
      trie[childIdx].fail = 0;
      queue.push(childIdx);
    }

    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(displayPattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Patterns', values: patterns },
        { label: 'Phase', values: ['Building failure links'] },
      ],
      stepDescription: 'Building failure links using BFS. Depth-1 nodes all fail to root.',
    });

    while (queue.length > 0) {
      const u = queue.shift()!;

      for (const [ch, v] of trie[u].children) {
        let f = trie[u].fail;
        while (f !== 0 && !trie[f].children.has(ch)) {
          f = trie[f].fail;
        }
        trie[v].fail = trie[f].children.has(ch) ? trie[f].children.get(ch)! : 0;

        // Merge output from failure link
        trie[v].output = [...trie[v].output, ...trie[trie[v].fail].output];

        queue.push(v);
      }
    }

    // Build a summary of failure links for display
    const failLinks: (number | string)[] = [];
    for (let i = 0; i < Math.min(trie.length, 12); i++) {
      failLinks.push(`${i}:${trie[i].fail}`);
    }
    if (trie.length > 12) {
      failLinks.push('...');
    }

    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(displayPattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Patterns', values: patterns },
        { label: 'Fail', values: failLinks },
      ],
      stepDescription: `Failure links computed for all ${trie.length} nodes. Automaton is ready.`,
    });

    // ── Phase 3: Search ──────────────────────────────────────────────
    let state = 0;
    const matchesFound: { pattern: string; index: number }[] = [];

    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(displayPattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Patterns', values: patterns },
        { label: 'State', values: [0] },
      ],
      stepDescription: 'Starting multi-pattern search. Current automaton state: 0 (root).',
    });

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const prevState = state;

      // Transition
      while (state !== 0 && !trie[state].children.has(ch)) {
        state = trie[state].fail;
      }
      state = trie[state].children.has(ch) ? trie[state].children.get(ch)! : 0;

      // Show the transition
      const textCellsTrans = makeTextCells(text);
      textCellsTrans[i] = { char: text[i], color: COLORS.comparing };

      // Color previously matched regions
      for (const m of matchesFound) {
        for (let j = m.index; j < m.index + m.pattern.length; j++) {
          if (j !== i && j < text.length) {
            textCellsTrans[j] = { char: text[j], color: COLORS.found };
          }
        }
      }

      this.steps.push({
        text: textCellsTrans,
        pattern: makePatternCells(displayPattern),
        patternOffset: 0,
        auxiliaryData: [
          { label: 'Patterns', values: patterns },
          { label: 'State', values: [`${prevState} -> ${state}`] },
          { label: 'Char', values: [ch] },
        ],
        stepDescription: `Read '${ch}' at index ${i}. Transition: state ${prevState} -> ${state}.`,
      });

      // Check for output at this state
      if (trie[state].output.length > 0) {
        for (const foundPat of trie[state].output) {
          const matchStart = i - foundPat.length + 1;
          matchesFound.push({ pattern: foundPat, index: matchStart });

          const textCellsFound = makeTextCells(text);

          // Color all previous matches
          for (const m of matchesFound) {
            for (let j = m.index; j < m.index + m.pattern.length; j++) {
              if (j < text.length) {
                textCellsFound[j] = { char: text[j], color: COLORS.found };
              }
            }
          }

          // Highlight the current match specifically with green
          for (let j = matchStart; j <= i; j++) {
            textCellsFound[j] = { char: text[j], color: COLORS.match };
          }

          this.steps.push({
            text: textCellsFound,
            pattern: makePatternCells(displayPattern),
            patternOffset: 0,
            auxiliaryData: [
              { label: 'Patterns', values: patterns },
              { label: 'Found', values: matchesFound.map((m) => `"${m.pattern}"@${m.index}`) },
            ],
            stepDescription: `Pattern "${foundPat}" found at index ${matchStart}!`,
          });
        }
      }
    }

    // Final step
    const textCellsFinal = makeTextCells(text);
    for (const m of matchesFound) {
      for (let j = m.index; j < m.index + m.pattern.length; j++) {
        if (j < text.length) {
          textCellsFinal[j] = { char: text[j], color: COLORS.found };
        }
      }
    }

    this.steps.push({
      text: textCellsFinal,
      pattern: makePatternCells(displayPattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Patterns', values: patterns },
        { label: 'Found', values: matchesFound.length > 0
          ? matchesFound.map((m) => `"${m.pattern}"@${m.index}`)
          : ['none'],
        },
      ],
      stepDescription: matchesFound.length > 0
        ? `Aho-Corasick search complete. Found ${matchesFound.length} match(es): ${matchesFound.map((m) => `"${m.pattern}" at index ${m.index}`).join(', ')}.`
        : 'Aho-Corasick search complete. No patterns found in the text.',
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
