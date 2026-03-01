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

interface SuffixTreeNode {
  children: Map<string, { label: string; node: SuffixTreeNode }>;
  suffixIndex: number; // -1 for internal nodes
}

/**
 * Suffix Tree Construction Visualization (Naive O(n^2) approach)
 *
 * Builds a suffix tree by inserting each suffix one at a time.
 * Then demonstrates pattern search by traversing the tree.
 * Shows tree structure as edge labels at each step.
 */
export class SuffixTreeVisualization implements StringVisualizationEngine {
  name = 'Suffix Tree';
  visualizationType = 'string' as const;

  private steps: StringVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(text: string, pattern: string): StringVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const s = text + '$';
    const n = s.length;

    // Build a simple suffix tree (naive construction)
    const root: SuffixTreeNode = { children: new Map(), suffixIndex: -1 };

    const getEdgeLabels = (node: SuffixTreeNode, prefix: string): string[] => {
      const labels: string[] = [];
      for (const [, edge] of node.children) {
        const edgeStr = prefix + edge.label;
        labels.push(edgeStr);
        labels.push(...getEdgeLabels(edge.node, edgeStr + '/'));
      }
      return labels;
    };

    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Tree', values: ['(empty root)'] },
      ],
      stepDescription: `Building suffix tree for "${text}$". Inserting ${n} suffixes.`,
    });

    // Insert each suffix
    for (let i = 0; i < n; i++) {
      const suffix = s.substring(i);

      // Navigate the tree and insert
      let current = root;
      let remaining = suffix;

      while (remaining.length > 0) {
        const firstChar = remaining[0];
        const edge = current.children.get(firstChar);

        if (!edge) {
          // No edge starting with this character — create a new leaf
          const newNode: SuffixTreeNode = { children: new Map(), suffixIndex: i };
          current.children.set(firstChar, { label: remaining, node: newNode });
          break;
        } else {
          // Edge exists — see how far we can go
          const label = edge.label;
          let j = 0;
          while (j < label.length && j < remaining.length && label[j] === remaining[j]) {
            j++;
          }

          if (j === label.length) {
            // Consumed entire edge label — continue to child node
            current = edge.node;
            remaining = remaining.substring(j);
          } else {
            // Mismatch within the edge — split
            const splitNode: SuffixTreeNode = { children: new Map(), suffixIndex: -1 };

            // Original child gets the rest of the old label
            splitNode.children.set(label[j], { label: label.substring(j), node: edge.node });

            // New leaf for the remaining suffix
            const newLeaf: SuffixTreeNode = { children: new Map(), suffixIndex: i };
            splitNode.children.set(remaining[j], { label: remaining.substring(j), node: newLeaf });

            // Update parent edge to point to split node
            current.children.set(firstChar, { label: label.substring(0, j), node: splitNode });
            break;
          }
        }
      }

      // Show the suffix being inserted
      const textCellsInsert = makeTextCells(text);
      for (let k = i; k < text.length; k++) {
        textCellsInsert[k] = { char: text[k], color: COLORS.match };
      }

      const edges = getEdgeLabels(root, '');
      const displayEdges = edges.length <= 10
        ? edges
        : [...edges.slice(0, 9), `...(${edges.length} edges)`];

      this.steps.push({
        text: textCellsInsert,
        pattern: makePatternCells(pattern),
        patternOffset: 0,
        auxiliaryData: [
          { label: 'Suffix', values: [`${i}: "${suffix.length > 12 ? suffix.substring(0, 12) + '..' : suffix}"`] },
          { label: 'Edges', values: displayEdges },
        ],
        stepDescription: `Inserted suffix #${i}: "${suffix.length > 15 ? suffix.substring(0, 15) + '..' : suffix}". Tree now has ${edges.length} edges.`,
      });
    }

    // ── Phase 2: Search for pattern ──────────────────────────────────
    if (pattern.length > 0) {
      this.steps.push({
        text: makeTextCells(text),
        pattern: makePatternCells(pattern),
        patternOffset: 0,
        auxiliaryData: [
          { label: 'Search', values: [pattern] },
        ],
        stepDescription: `Searching for pattern "${pattern}" in the suffix tree.`,
      });

      let current = root;
      let remaining = pattern;
      let matched = 0;
      let found = true;

      while (remaining.length > 0) {
        const firstChar = remaining[0];
        const edge = current.children.get(firstChar);

        if (!edge) {
          found = false;
          const textCellsMiss = makeTextCells(text);
          const patCellsMiss = makePatternCells(pattern);
          if (matched < pattern.length) {
            patCellsMiss[matched] = { char: pattern[matched], color: COLORS.mismatch };
          }

          this.steps.push({
            text: textCellsMiss,
            pattern: patCellsMiss,
            patternOffset: 0,
            auxiliaryData: [
              { label: 'Status', values: ['No matching edge'] },
              { label: 'Matched', values: [matched] },
            ],
            stepDescription: `No edge starting with '${firstChar}' at current node. Pattern not found.`,
          });
          break;
        }

        const label = edge.label;
        let j = 0;
        while (j < label.length && j < remaining.length && label[j] === remaining[j]) {
          j++;
        }

        const textCellsTraverse = makeTextCells(text);
        const patCellsTraverse = makePatternCells(pattern);
        for (let k = 0; k < matched + j && k < pattern.length; k++) {
          patCellsTraverse[k] = { char: pattern[k], color: COLORS.match };
        }

        this.steps.push({
          text: textCellsTraverse,
          pattern: patCellsTraverse,
          patternOffset: 0,
          auxiliaryData: [
            { label: 'Edge', values: [`"${label}"`] },
            { label: 'Matched', values: [j] },
          ],
          stepDescription: `Traversing edge "${label}". Matched ${j} characters.`,
        });

        if (j < remaining.length && j < label.length) {
          // Mismatch within edge
          found = false;
          const patCellsMiss = makePatternCells(pattern);
          for (let k = 0; k < matched + j; k++) {
            patCellsMiss[k] = { char: pattern[k], color: COLORS.match };
          }
          if (matched + j < pattern.length) {
            patCellsMiss[matched + j] = { char: pattern[matched + j], color: COLORS.mismatch };
          }

          this.steps.push({
            text: makeTextCells(text),
            pattern: patCellsMiss,
            patternOffset: 0,
            auxiliaryData: [
              { label: 'Status', values: ['Mismatch within edge'] },
            ],
            stepDescription: `Mismatch within edge at position ${j}: '${remaining[j]}' != '${label[j]}'. Pattern not found.`,
          });
          break;
        }

        matched += j;
        remaining = remaining.substring(j);
        current = edge.node;
      }

      if (found && remaining.length === 0) {
        // Collect all leaf suffix indices under current node
        const collectLeaves = (node: SuffixTreeNode): number[] => {
          if (node.suffixIndex >= 0) return [node.suffixIndex];
          const leaves: number[] = [];
          for (const [, edge] of node.children) {
            leaves.push(...collectLeaves(edge.node));
          }
          return leaves;
        };

        const positions = collectLeaves(current).sort((a, b) => a - b);

        const textCellsFound = makeTextCells(text);
        const patCellsFound = makePatternCells(pattern);
        for (const pos of positions) {
          for (let k = pos; k < pos + pattern.length && k < text.length; k++) {
            textCellsFound[k] = { char: text[k], color: COLORS.found };
          }
        }
        for (let k = 0; k < pattern.length; k++) {
          patCellsFound[k] = { char: pattern[k], color: COLORS.found };
        }

        this.steps.push({
          text: textCellsFound,
          pattern: patCellsFound,
          patternOffset: positions.length > 0 ? positions[0] : 0,
          auxiliaryData: [
            { label: 'Positions', values: positions },
          ],
          stepDescription: `Pattern "${pattern}" found at position(s): [${positions.join(', ')}].`,
        });
      }
    }

    // Final step
    const edges = getEdgeLabels(root, '');
    this.steps.push({
      text: makeTextCells(text),
      pattern: makePatternCells(pattern),
      patternOffset: 0,
      auxiliaryData: [
        { label: 'Total Edges', values: [edges.length] },
      ],
      stepDescription: `Suffix tree construction and search complete. Tree has ${edges.length} edges.`,
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
