import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  comparing: '#eab308',
  swapping: '#ef4444',
  enqueuing: '#22c55e',
  dequeuing: '#3b82f6',
  heapified: '#22c55e',
  minimum: '#8b5cf6',
};

export class PriorityQueueVisualization implements AlgorithmVisualization {
  name = 'Priority Queue';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const heap: number[] = [];
    const dequeued: number[] = [];

    const parent = (i: number) => Math.floor((i - 1) / 2);
    const left = (i: number) => 2 * i + 1;
    const right = (i: number) => 2 * i + 2;

    const pad = (): number[] => {
      const arr = [...heap];
      while (arr.length < data.length) arr.push(0);
      return arr;
    };

    this.steps.push({
      data: new Array(data.length).fill(0),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: 'Min-Priority Queue backed by binary heap. Supports enqueue (insert with priority) and dequeue (extract minimum priority).',
    });

    // ENQUEUE phase
    for (let i = 0; i < data.length; i++) {
      const priority = data[i];
      heap.push(priority);
      let pos = heap.length - 1;

      this.steps.push({
        data: pad(),
        highlights: [
          { index: pos, color: COLORS.enqueuing, label: `enq:${priority}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `ENQUEUE priority ${priority}: added at index ${pos}. Heap size: ${heap.length}. Sifting up to maintain heap property.`,
      });

      // Sift up
      while (pos > 0 && heap[pos] < heap[parent(pos)]) {
        const par = parent(pos);

        this.steps.push({
          data: pad(),
          highlights: [
            { index: pos, color: COLORS.comparing, label: `${heap[pos]}` },
            { index: par, color: COLORS.comparing, label: `${heap[par]}` },
          ],
          comparisons: [[pos, par]],
          swaps: [],
          sorted: [],
          stepDescription: `Sift-up: ${heap[pos]} < parent ${heap[par]}. Swapping positions ${pos} and ${par}.`,
        });

        const temp = heap[pos];
        heap[pos] = heap[par];
        heap[par] = temp;

        this.steps.push({
          data: pad(),
          highlights: [
            { index: par, color: COLORS.swapping, label: `${heap[par]}` },
            { index: pos, color: COLORS.swapping, label: `${heap[pos]}` },
          ],
          comparisons: [],
          swaps: [[pos, par]],
          sorted: [],
          stepDescription: `Swapped. ${heap[par]} moved up to index ${par}.`,
        });

        pos = par;
      }

      if (pos === 0 || heap[pos] >= heap[parent(pos)]) {
        this.steps.push({
          data: pad(),
          highlights: [
            { index: 0, color: COLORS.minimum, label: `min:${heap[0]}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Enqueue complete. Heap property satisfied. Current minimum priority: ${heap[0]}. Queue size: ${heap.length}.`,
        });
      }
    }

    // DEQUEUE phase - extract minimum repeatedly
    const dequeueCount = Math.min(Math.ceil(data.length / 2), heap.length);
    for (let d = 0; d < dequeueCount; d++) {
      if (heap.length === 0) break;

      const minPriority = heap[0];
      dequeued.push(minPriority);

      this.steps.push({
        data: pad(),
        highlights: [
          { index: 0, color: COLORS.dequeuing, label: `deq:${minPriority}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `DEQUEUE: extracting minimum priority ${minPriority}. Moving last element (${heap[heap.length - 1]}) to root.`,
      });

      heap[0] = heap[heap.length - 1];
      heap.pop();

      if (heap.length === 0) {
        this.steps.push({
          data: pad(),
          highlights: [],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Queue is empty. Dequeued in order: [${dequeued.join(', ')}].`,
        });
        continue;
      }

      // Sift down
      let pos = 0;
      while (true) {
        const l = left(pos);
        const r = right(pos);
        let smallest = pos;

        if (l < heap.length && heap[l] < heap[smallest]) smallest = l;
        if (r < heap.length && heap[r] < heap[smallest]) smallest = r;

        if (smallest === pos) {
          this.steps.push({
            data: pad(),
            highlights: [
              { index: pos, color: COLORS.heapified, label: `${heap[pos]}` },
            ],
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `Sift-down complete. ${heap[pos]} at index ${pos} is <= both children. New min: ${heap[0]}.`,
          });
          break;
        }

        this.steps.push({
          data: pad(),
          highlights: [
            { index: pos, color: COLORS.comparing, label: `${heap[pos]}` },
            { index: smallest, color: COLORS.comparing, label: `${heap[smallest]}` },
          ],
          comparisons: [[pos, smallest]],
          swaps: [],
          sorted: [],
          stepDescription: `Sift-down: ${heap[pos]} > child ${heap[smallest]} at index ${smallest}. Swapping.`,
        });

        const temp = heap[pos];
        heap[pos] = heap[smallest];
        heap[smallest] = temp;

        this.steps.push({
          data: pad(),
          highlights: [
            { index: pos, color: COLORS.swapping, label: `${heap[pos]}` },
            { index: smallest, color: COLORS.swapping, label: `${heap[smallest]}` },
          ],
          comparisons: [],
          swaps: [[pos, smallest]],
          sorted: [],
          stepDescription: `Swapped positions ${pos} and ${smallest}. Continuing sift-down.`,
        });

        pos = smallest;
      }
    }

    this.steps.push({
      data: pad(),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: heap.length }, (_, i) => i),
      stepDescription: `Priority Queue complete. Dequeued in priority order: [${dequeued.join(', ')}]. Remaining: [${heap.join(', ')}]. Enqueue/Dequeue: O(log n).`,
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
