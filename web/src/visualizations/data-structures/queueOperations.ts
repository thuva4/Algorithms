import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  enqueue: '#22c55e',
  dequeue: '#ef4444',
  front: '#3b82f6',
  rear: '#8b5cf6',
  peek: '#eab308',
  element: '#6b7280',
};

export class QueueOperationsVisualization implements AlgorithmVisualization {
  name = 'Queue Operations';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const queue: number[] = [];
    const dequeued: number[] = [];

    const pad = (): number[] => {
      const arr = [...queue];
      while (arr.length < data.length) arr.push(0);
      return arr;
    };

    const queueIndices = (): number[] => Array.from({ length: queue.length }, (_, i) => i);

    this.steps.push({
      data: new Array(data.length).fill(0),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: 'Queue (FIFO): First-In-First-Out. Enqueue adds to rear, Dequeue removes from front.',
    });

    // ENQUEUE phase
    const enqueueCount = Math.min(data.length, 8);
    for (let i = 0; i < enqueueCount; i++) {
      const val = data[i];
      queue.push(val);

      const highlights: { index: number; color: string; label?: string }[] = [
        { index: queue.length - 1, color: COLORS.enqueue, label: `enq:${val}` },
      ];
      if (queue.length > 1) {
        highlights.push({ index: 0, color: COLORS.front, label: 'front' });
      }
      if (queue.length > 1) {
        highlights.push({ index: queue.length - 1, color: COLORS.rear, label: 'rear' });
      }

      this.steps.push({
        data: pad(),
        highlights,
        comparisons: [],
        swaps: [],
        sorted: queueIndices(),
        stepDescription: `ENQUEUE ${val}: added to rear (index ${queue.length - 1}). Queue size: ${queue.length}. Front: ${queue[0]}, Rear: ${queue[queue.length - 1]}. O(1) operation.`,
      });
    }

    // PEEK
    if (queue.length > 0) {
      this.steps.push({
        data: pad(),
        highlights: [
          { index: 0, color: COLORS.peek, label: `peek:${queue[0]}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: queueIndices(),
        stepDescription: `PEEK: front element is ${queue[0]}. Does not remove it. Queue unchanged. O(1) operation.`,
      });
    }

    // DEQUEUE phase - remove from front
    const dequeueCount = Math.min(Math.ceil(enqueueCount / 2), queue.length);
    for (let d = 0; d < dequeueCount; d++) {
      if (queue.length === 0) break;

      const val = queue[0];
      dequeued.push(val);

      this.steps.push({
        data: pad(),
        highlights: [
          { index: 0, color: COLORS.dequeue, label: `deq:${val}` },
          ...(queue.length > 1 ? [{ index: queue.length - 1, color: COLORS.rear, label: 'rear' }] : []),
        ],
        comparisons: [],
        swaps: [],
        sorted: queueIndices(),
        stepDescription: `DEQUEUE: removing front element ${val}. FIFO order maintained.`,
      });

      queue.shift();

      this.steps.push({
        data: pad(),
        highlights: queue.length > 0
          ? [
              { index: 0, color: COLORS.front, label: `front:${queue[0]}` },
              ...(queue.length > 1 ? [{ index: queue.length - 1, color: COLORS.rear, label: `rear:${queue[queue.length - 1]}` }] : []),
            ]
          : [],
        comparisons: [],
        swaps: [],
        sorted: queueIndices(),
        stepDescription: `Removed ${val}. Queue size: ${queue.length}.${queue.length > 0 ? ` New front: ${queue[0]}.` : ' Queue is empty.'} Dequeued so far: [${dequeued.join(', ')}].`,
      });
    }

    // Enqueue more to show interleaved operations
    const moreEnqueue = Math.min(2, data.length - enqueueCount);
    for (let i = 0; i < moreEnqueue; i++) {
      const val = data[enqueueCount + i];
      queue.push(val);

      this.steps.push({
        data: pad(),
        highlights: [
          { index: queue.length - 1, color: COLORS.enqueue, label: `enq:${val}` },
          { index: 0, color: COLORS.front, label: 'front' },
        ],
        comparisons: [],
        swaps: [],
        sorted: queueIndices(),
        stepDescription: `ENQUEUE ${val}: added to rear. Queue: [${queue.join(', ')}]. Size: ${queue.length}.`,
      });
    }

    // Check if empty
    this.steps.push({
      data: pad(),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: queueIndices(),
      stepDescription: `IS_EMPTY: ${queue.length === 0 ? 'true' : 'false'}. SIZE: ${queue.length}. O(1) operations.`,
    });

    // Final state
    this.steps.push({
      data: pad(),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: queueIndices(),
      stepDescription: `Queue operations complete. Remaining: [${queue.join(', ')}]. Dequeued in FIFO order: [${dequeued.join(', ')}]. All operations O(1).`,
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
