import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  comparing: '#eab308',
  swapping: '#ef4444',
  sorted: '#22c55e',
  current: '#3b82f6',
};

interface BSTNode {
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

export class TreeSortVisualization implements AlgorithmVisualization {
  name = 'Tree Sort';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const arr = [...data];
    const n = arr.length;
    const sorted: number[] = [];

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: 'Initial array state',
    });

    // Build BST
    let root: BSTNode | null = null;

    const self = this;

    function insert(node: BSTNode | null, value: number, sourceIndex: number): BSTNode {
      if (node === null) {
        self.steps.push({
          data: [...arr],
          highlights: [
            { index: sourceIndex, color: COLORS.sorted, label: `${value}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Inserted ${value} into BST`,
        });
        return { value, left: null, right: null };
      }

      self.steps.push({
        data: [...arr],
        highlights: [
          { index: sourceIndex, color: COLORS.comparing, label: `${value}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Comparing ${value} with node ${node.value}: going ${value <= node.value ? 'left' : 'right'}`,
      });

      if (value <= node.value) {
        node.left = insert(node.left, value, sourceIndex);
      } else {
        node.right = insert(node.right, value, sourceIndex);
      }
      return node;
    }

    // Insert all elements into BST
    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: 'Phase 1: Building Binary Search Tree',
    });

    for (let i = 0; i < n; i++) {
      self.steps.push({
        data: [...arr],
        highlights: [
          { index: i, color: COLORS.current, label: `${arr[i]}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Inserting element ${arr[i]} from position ${i} into BST`,
      });

      root = insert(root, arr[i], i);
    }

    // In-order traversal to extract sorted elements
    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: 'Phase 2: In-order traversal to extract sorted elements',
    });

    let idx = 0;

    function inOrder(node: BSTNode | null) {
      if (node === null) return;
      inOrder(node.left);

      arr[idx] = node.value;
      sorted.push(idx);

      self.steps.push({
        data: [...arr],
        highlights: [
          { index: idx, color: COLORS.sorted, label: `${node.value}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [...sorted],
        stepDescription: `In-order visit: placing ${node.value} at position ${idx}`,
      });

      idx++;
      inOrder(node.right);
    }

    inOrder(root);

    // Final sorted state
    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: n }, (_, i) => i),
      stepDescription: 'Array is fully sorted',
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
