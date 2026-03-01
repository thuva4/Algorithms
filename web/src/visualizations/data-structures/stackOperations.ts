import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  push: '#22c55e',
  pop: '#ef4444',
  top: '#eab308',
  peek: '#3b82f6',
  element: '#8b5cf6',
  empty: '#6b7280',
};

export class StackOperationsVisualization implements AlgorithmVisualization {
  name = 'Stack Operations';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const stack: number[] = [];
    const popped: number[] = [];

    const pad = (): number[] => {
      const arr = [...stack];
      while (arr.length < data.length) arr.push(0);
      return arr;
    };

    const stackIndices = (): number[] => Array.from({ length: stack.length }, (_, i) => i);

    this.steps.push({
      data: new Array(data.length).fill(0),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: 'Stack (LIFO): Last-In-First-Out. Push adds to top, Pop removes from top. Array-based implementation.',
    });

    // PUSH phase
    const pushCount = Math.min(data.length, 8);
    for (let i = 0; i < pushCount; i++) {
      const val = data[i];
      stack.push(val);

      this.steps.push({
        data: pad(),
        highlights: [
          { index: stack.length - 1, color: COLORS.push, label: `push:${val}` },
          ...(stack.length >= 2 ? [{ index: stack.length - 2, color: COLORS.element, label: `${stack[stack.length - 2]}` }] : []),
        ],
        comparisons: [],
        swaps: [],
        sorted: stackIndices(),
        stepDescription: `PUSH ${val}: added to top (index ${stack.length - 1}). Stack size: ${stack.length}. Top: ${stack[stack.length - 1]}. O(1) operation.`,
      });
    }

    // PEEK
    if (stack.length > 0) {
      this.steps.push({
        data: pad(),
        highlights: [
          { index: stack.length - 1, color: COLORS.peek, label: `peek:${stack[stack.length - 1]}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: stackIndices(),
        stepDescription: `PEEK: top element is ${stack[stack.length - 1]}. Element NOT removed. Stack unchanged. O(1) operation.`,
      });
    }

    // Show full stack state
    this.steps.push({
      data: pad(),
      highlights: stack.map((v, i) => ({
        index: i,
        color: i === stack.length - 1 ? COLORS.top : COLORS.element,
        label: i === 0 ? `bottom:${v}` : i === stack.length - 1 ? `top:${v}` : `${v}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: stackIndices(),
      stepDescription: `Stack state: [${stack.join(', ')}]. Bottom: ${stack[0]}, Top: ${stack[stack.length - 1]}. Size: ${stack.length}.`,
    });

    // POP phase
    const popCount = Math.min(Math.ceil(pushCount / 2), stack.length);
    for (let p = 0; p < popCount; p++) {
      if (stack.length === 0) break;

      const val = stack[stack.length - 1];
      popped.push(val);

      this.steps.push({
        data: pad(),
        highlights: [
          { index: stack.length - 1, color: COLORS.pop, label: `pop:${val}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: stackIndices(),
        stepDescription: `POP: removing top element ${val} from index ${stack.length - 1}. LIFO order.`,
      });

      stack.pop();

      this.steps.push({
        data: pad(),
        highlights: stack.length > 0
          ? [{ index: stack.length - 1, color: COLORS.top, label: `new top:${stack[stack.length - 1]}` }]
          : [],
        comparisons: [],
        swaps: [],
        sorted: stackIndices(),
        stepDescription: `Popped ${val}. Stack size: ${stack.length}.${stack.length > 0 ? ` New top: ${stack[stack.length - 1]}.` : ' Stack is empty.'} Popped so far: [${popped.join(', ')}].`,
      });
    }

    // Push a few more to show interleaved operations
    const morePush = Math.min(2, data.length - pushCount);
    for (let i = 0; i < morePush; i++) {
      const val = data[pushCount + i];
      stack.push(val);

      this.steps.push({
        data: pad(),
        highlights: [
          { index: stack.length - 1, color: COLORS.push, label: `push:${val}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: stackIndices(),
        stepDescription: `PUSH ${val}: interleaved operation. Stack: [${stack.join(', ')}]. Size: ${stack.length}.`,
      });
    }

    // IS_EMPTY and SIZE checks
    this.steps.push({
      data: pad(),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: stackIndices(),
      stepDescription: `IS_EMPTY: ${stack.length === 0}. SIZE: ${stack.length}. Both O(1) operations.`,
    });

    // Pop remaining to show LIFO ordering
    const remainingPops: number[] = [];
    while (stack.length > 0) {
      const val = stack.pop()!;
      remainingPops.push(val);
      popped.push(val);
    }

    if (remainingPops.length > 0) {
      this.steps.push({
        data: pad(),
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Popped remaining elements: [${remainingPops.join(', ')}]. Full pop order (LIFO): [${popped.join(', ')}].`,
      });
    }

    this.steps.push({
      data: pad(),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Stack operations complete. All operations O(1). Pop order is reverse of push order (LIFO). Used in: function calls, undo operations, expression evaluation, DFS.`,
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
