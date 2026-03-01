import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  leftSubtree: '#3b82f6',
  rightSubtree: '#22c55e',
  splitting: '#ef4444',
  concatenating: '#eab308',
  rebalancing: '#8b5cf6',
  weight: '#f97316',
  leaf: '#22c55e',
};

interface RopeNode {
  weight: number;
  value: string | null; // null for internal nodes
  left: RopeNode | null;
  right: RopeNode | null;
}

export class RopeDataStructureVisualization implements AlgorithmVisualization {
  name = 'Rope Data Structure';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  private totalLength(node: RopeNode | null): number {
    if (!node) return 0;
    if (node.value !== null) return node.value.length;
    return this.totalLength(node.left) + this.totalLength(node.right);
  }

  private flatten(node: RopeNode | null): number[] {
    if (!node) return [];
    if (node.value !== null) {
      return node.value.split('').map(c => c.charCodeAt(0) - 64); // A=1, B=2, etc.
    }
    return [...this.flatten(node.left), ...this.flatten(node.right)];
  }

  private treeToArray(node: RopeNode | null): number[] {
    // BFS order of weights for visualization
    if (!node) return [];
    const result: number[] = [];
    const queue: (RopeNode | null)[] = [node];
    while (queue.length > 0 && result.length < 15) {
      const n = queue.shift()!;
      if (n) {
        result.push(n.weight);
        queue.push(n.left);
        queue.push(n.right);
      } else {
        result.push(0);
      }
    }
    return result;
  }

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Build strings from data values
    const chars = data.map(v => String.fromCharCode(65 + (Math.abs(v) % 26)));
    const fullString = chars.join('');
    const segmentSize = Math.max(2, Math.floor(chars.length / 4));

    // Build rope from segments
    const segments: string[] = [];
    for (let i = 0; i < fullString.length; i += segmentSize) {
      segments.push(fullString.slice(i, i + segmentSize));
    }

    const buildData = (node: RopeNode | null): number[] => {
      const arr = this.treeToArray(node);
      while (arr.length < data.length) arr.push(0);
      return arr.slice(0, data.length);
    };

    this.steps.push({
      data: data.map(v => Math.abs(v) % 26 + 1),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Rope data structure: representing string "${fullString}" (length ${fullString.length}). Splitting into ${segments.length} leaf segments.`,
    });

    // Create leaf nodes
    const leaves: RopeNode[] = segments.map(s => ({
      weight: s.length,
      value: s,
      left: null,
      right: null,
    }));

    // Show leaf creation
    for (let i = 0; i < leaves.length; i++) {
      this.steps.push({
        data: data.map(v => Math.abs(v) % 26 + 1),
        highlights: Array.from({ length: segments[i].length }, (_, j) => ({
          index: i * segmentSize + j,
          color: COLORS.leaf,
          label: segments[i][j],
        })).filter(h => h.index < data.length),
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Leaf ${i}: "${segments[i]}" (weight=${segments[i].length}). Leaf nodes store actual string fragments.`,
      });
    }

    // Build tree bottom-up by concatenation
    let currentNodes = [...leaves];
    let concatStep = 0;

    while (currentNodes.length > 1) {
      const nextLevel: RopeNode[] = [];

      for (let i = 0; i < currentNodes.length; i += 2) {
        if (i + 1 < currentNodes.length) {
          const leftNode = currentNodes[i];
          const rightNode = currentNodes[i + 1];
          const leftLen = this.totalLength(leftNode);
          const parent: RopeNode = {
            weight: leftLen,
            value: null,
            left: leftNode,
            right: rightNode,
          };
          nextLevel.push(parent);

          concatStep++;
          this.steps.push({
            data: buildData(parent),
            highlights: [
              { index: 0, color: COLORS.concatenating, label: `w=${leftLen}` },
            ],
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `CONCATENATE step ${concatStep}: join left subtree (length ${leftLen}) with right subtree (length ${this.totalLength(rightNode)}). Internal node weight = ${leftLen} (left subtree length).`,
          });
        } else {
          nextLevel.push(currentNodes[i]);
        }
      }

      currentNodes = nextLevel;
    }

    const root = currentNodes[0] || null;

    this.steps.push({
      data: buildData(root),
      highlights: root ? [{ index: 0, color: COLORS.weight, label: `root:w=${root.weight}` }] : [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Rope built. Root weight = ${root?.weight || 0} (total left subtree length). Full string: "${fullString}". Tree height: O(log n).`,
    });

    // SPLIT operation
    if (root && fullString.length >= 4) {
      const splitPos = Math.floor(fullString.length / 2);

      this.steps.push({
        data: buildData(root),
        highlights: Array.from({ length: splitPos }, (_, i) => ({
          index: i,
          color: COLORS.leftSubtree,
        })).filter(h => h.index < data.length),
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `SPLIT at position ${splitPos}: dividing "${fullString}" into "${fullString.slice(0, splitPos)}" and "${fullString.slice(splitPos)}". Traverse tree using weights to find split point.`,
      });

      // Simulate split traversal
      let current = root;
      let remaining = splitPos;
      const path: string[] = [];

      while (current && current.value === null) {
        if (remaining <= current.weight) {
          path.push(`weight=${current.weight}, go LEFT (${remaining} <= ${current.weight})`);
          current = current.left!;
        } else {
          remaining -= current.weight;
          path.push(`weight=${current.weight}, go RIGHT (${remaining} left after subtracting ${current.weight})`);
          current = current.right!;
        }
      }

      this.steps.push({
        data: buildData(root),
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Split traversal: ${path.join(' -> ')}. Found split point in O(log n). Tree restructured into two ropes.`,
      });

      // Show the two resulting pieces
      this.steps.push({
        data: data.map(v => Math.abs(v) % 26 + 1),
        highlights: [
          ...Array.from({ length: splitPos }, (_, i) => ({
            index: i,
            color: COLORS.leftSubtree,
            label: fullString[i],
          })).filter(h => h.index < data.length),
          ...Array.from({ length: fullString.length - splitPos }, (_, i) => ({
            index: splitPos + i,
            color: COLORS.rightSubtree,
            label: fullString[splitPos + i],
          })).filter(h => h.index < data.length),
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Split result: Left rope = "${fullString.slice(0, splitPos)}", Right rope = "${fullString.slice(splitPos)}". Both are valid ropes.`,
      });
    }

    // INDEX operation
    if (root && fullString.length > 2) {
      const queryIdx = Math.min(3, fullString.length - 1);

      this.steps.push({
        data: buildData(root),
        highlights: [
          { index: Math.min(queryIdx, data.length - 1), color: COLORS.weight, label: `idx=${queryIdx}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `INDEX query: charAt(${queryIdx}) = "${fullString[queryIdx]}". Navigate using weights: if index < weight, go left; otherwise subtract weight and go right. O(log n).`,
      });
    }

    this.steps.push({
      data: data.map(v => Math.abs(v) % 26 + 1),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: data.length }, (_, i) => i),
      stepDescription: `Rope operations complete. Concat: O(1), Split: O(log n), Index: O(log n). Efficient for large-scale text editing.`,
    });

    return this.steps[0];
  }

  step(): VisualizationState | null {
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
