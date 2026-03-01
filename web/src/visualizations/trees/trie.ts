import type { TreeVisualizationEngine, TreeVisualizationState, TreeNodeData } from '../types';

const COLORS = {
  default: '#64748b',
  highlighted: '#3b82f6',
  inserted: '#22c55e',
  compared: '#eab308',
  removed: '#ef4444',
};

interface TrieNodeInternal {
  id: string;
  char: string;
  isEnd: boolean;
  children: Map<string, TrieNodeInternal>;
}

let nodeCounter = 0;

function createTrieNode(char: string): TrieNodeInternal {
  return {
    id: `trie-${nodeCounter++}`,
    char,
    isEnd: false,
    children: new Map(),
  };
}

function cloneTrie(node: TrieNodeInternal | null): TrieNodeInternal | null {
  if (!node) return null;
  const cloned: TrieNodeInternal = {
    id: node.id,
    char: node.char,
    isEnd: node.isEnd,
    children: new Map(),
  };
  for (const [key, child] of node.children) {
    cloned.children.set(key, cloneTrie(child)!);
  }
  return cloned;
}

function trieToTreeNodeData(node: TrieNodeInternal | null, colorMap: Map<string, string>): TreeNodeData | null {
  if (!node) return null;
  const childNodes: TreeNodeData[] = [];
  const sortedKeys = Array.from(node.children.keys()).sort();
  for (const key of sortedKeys) {
    const child = trieToTreeNodeData(node.children.get(key)!, colorMap);
    if (child) childNodes.push(child);
  }
  const label = node.char === '' ? 'root' : `${node.char}${node.isEnd ? '*' : ''}`;
  const result: TreeNodeData = {
    id: node.id,
    value: label,
    color: colorMap.get(node.id) ?? COLORS.default,
  };
  if (childNodes.length > 0) {
    result.children = childNodes;
  }
  return result;
}

/**
 * Trie (Prefix Tree) visualization.
 * Converts numbers to strings and inserts them character by character.
 * Demonstrates insertion and search operations.
 */
export class TrieVisualization implements TreeVisualizationEngine {
  name = 'Trie';
  visualizationType = 'tree' as const;
  private steps: TreeVisualizationState[] = [];
  private currentStepIndex = -1;

  private addStep(root: TrieNodeInternal | null, colorMap: Map<string, string>, highlighted: string[], description: string): void {
    this.steps.push({
      root: trieToTreeNodeData(cloneTrie(root), colorMap),
      highlightedNodes: highlighted,
      stepDescription: description,
    });
  }

  private insertWord(root: TrieNodeInternal, word: string): void {
    let node = root;
    const path: string[] = [root.id];

    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      if (!node.children.has(ch)) {
        const newChild = createTrieNode(ch);
        node.children.set(ch, newChild);

        const colorMap = new Map<string, string>();
        colorMap.set(newChild.id, COLORS.inserted);
        for (const pid of path) colorMap.set(pid, COLORS.compared);
        this.addStep(root, colorMap, [newChild.id],
          `Insert "${word}": created new node '${ch}' (position ${i})`);
      } else {
        const existing = node.children.get(ch)!;
        const colorMap = new Map<string, string>();
        colorMap.set(existing.id, COLORS.compared);
        this.addStep(root, colorMap, [existing.id],
          `Insert "${word}": traversing existing node '${ch}' (position ${i})`);
      }

      node = node.children.get(ch)!;
      path.push(node.id);
    }

    node.isEnd = true;
    const endMap = new Map<string, string>();
    endMap.set(node.id, COLORS.highlighted);
    this.addStep(root, endMap, [node.id],
      `Insert "${word}": marked node '${node.char}' as end-of-word`);
  }

  private searchWord(root: TrieNodeInternal, word: string): boolean {
    let node = root;

    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      if (!node.children.has(ch)) {
        const colorMap = new Map<string, string>();
        colorMap.set(node.id, COLORS.removed);
        this.addStep(root, colorMap, [node.id],
          `Search "${word}": character '${ch}' not found at position ${i} -- NOT FOUND`);
        return false;
      }

      node = node.children.get(ch)!;
      const colorMap = new Map<string, string>();
      colorMap.set(node.id, COLORS.compared);
      this.addStep(root, colorMap, [node.id],
        `Search "${word}": found '${ch}' at position ${i}`);
    }

    if (node.isEnd) {
      const colorMap = new Map<string, string>();
      colorMap.set(node.id, COLORS.inserted);
      this.addStep(root, colorMap, [node.id],
        `Search "${word}": FOUND (end-of-word marker present)`);
      return true;
    } else {
      const colorMap = new Map<string, string>();
      colorMap.set(node.id, COLORS.removed);
      this.addStep(root, colorMap, [node.id],
        `Search "${word}": prefix exists but no end-of-word marker -- NOT FOUND as complete word`);
      return false;
    }
  }

  initialize(values: number[]): TreeVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    nodeCounter = 0;

    if (values.length === 0) {
      this.steps.push({ root: null, highlightedNodes: [], stepDescription: 'No values provided' });
      return this.steps[0];
    }

    const root = createTrieNode('');

    // Convert numbers to strings for trie insertion
    const words = values.map(v => String(Math.abs(v)));
    // Remove duplicates but keep order
    const uniqueWords = [...new Set(words)];

    this.steps.push({
      root: null,
      highlightedNodes: [],
      stepDescription: `Building Trie with words: [${uniqueWords.map(w => `"${w}"`).join(', ')}]`,
    });

    // Insert words
    for (const word of uniqueWords) {
      this.addStep(root, new Map(), [], `--- Inserting "${word}" ---`);
      this.insertWord(root, word);
    }

    this.addStep(root, new Map(), [],
      `Trie built with ${uniqueWords.length} words`);

    // Search for some words
    const mid = Math.floor(values.length / 2);
    const searchTargets = [
      String(Math.abs(values[0])),
      String(Math.abs(values[mid])),
      String(Math.abs(values[0]) + 999), // Likely not in trie
    ];

    for (const target of searchTargets) {
      this.addStep(root, new Map(), [], `--- Searching for "${target}" ---`);
      this.searchWord(root, target);
    }

    // Demonstrate prefix search
    if (uniqueWords[0].length > 1) {
      const prefix = uniqueWords[0].substring(0, 1);
      this.addStep(root, new Map(), [], `--- Prefix search for "${prefix}" ---`);
      let node = root;
      let found = true;
      for (const ch of prefix) {
        if (!node.children.has(ch)) { found = false; break; }
        node = node.children.get(ch)!;
      }
      if (found) {
        const colorMap = new Map<string, string>();
        colorMap.set(node.id, COLORS.highlighted);
        // Highlight all descendants
        const highlightAll = (n: TrieNodeInternal) => {
          colorMap.set(n.id, COLORS.inserted);
          for (const child of n.children.values()) highlightAll(child);
        };
        highlightAll(node);
        this.addStep(root, colorMap, [node.id],
          `Prefix "${prefix}" found: all words with this prefix are in the highlighted subtree`);
      }
    }

    this.addStep(root, new Map(), [],
      `Trie operations complete`);

    return this.steps[0];
  }

  step(): TreeVisualizationState | null {
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
