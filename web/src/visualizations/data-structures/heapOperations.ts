import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  comparing: '#eab308',
  swapping: '#ef4444',
  inserting: '#22c55e',
  extracting: '#3b82f6',
  sifting: '#8b5cf6',
  heapified: '#22c55e',
};

export class HeapOperationsVisualization implements AlgorithmVisualization {
  name = 'Heap Operations';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const heap: number[] = [];
    const extracted: number[] = [];

    const parent = (i: number) => Math.floor((i - 1) / 2);
    const left = (i: number) => 2 * i + 1;
    const right = (i: number) => 2 * i + 2;

    const heapIndices = (): number[] => Array.from({ length: heap.length }, (_, i) => i);

    this.steps.push({
      data: [...data],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: 'Min-Heap: empty. Will insert elements one by one using sift-up, then extract-min using sift-down.',
    });

    // INSERT phase: sift-up
    const insertCount = Math.min(data.length, 10);
    for (let i = 0; i < insertCount; i++) {
      const val = data[i];
      heap.push(val);
      let pos = heap.length - 1;

      this.steps.push({
        data: [...heap, ...new Array(Math.max(0, data.length - heap.length)).fill(0)],
        highlights: [
          { index: pos, color: COLORS.inserting, label: `insert ${val}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `INSERT ${val}: placed at index ${pos} (end of array). Starting sift-up.`,
      });

      // Sift up
      while (pos > 0) {
        const par = parent(pos);

        this.steps.push({
          data: [...heap, ...new Array(Math.max(0, data.length - heap.length)).fill(0)],
          highlights: [
            { index: pos, color: COLORS.comparing, label: `${heap[pos]}` },
            { index: par, color: COLORS.comparing, label: `${heap[par]}` },
          ],
          comparisons: [[pos, par]],
          swaps: [],
          sorted: [],
          stepDescription: `Sift-up: comparing ${heap[pos]} (index ${pos}) with parent ${heap[par]} (index ${par}).`,
        });

        if (heap[pos] < heap[par]) {
          const temp = heap[pos];
          heap[pos] = heap[par];
          heap[par] = temp;

          this.steps.push({
            data: [...heap, ...new Array(Math.max(0, data.length - heap.length)).fill(0)],
            highlights: [
              { index: par, color: COLORS.swapping, label: `${heap[par]}` },
              { index: pos, color: COLORS.swapping, label: `${heap[pos]}` },
            ],
            comparisons: [],
            swaps: [[pos, par]],
            sorted: [],
            stepDescription: `Swap! ${heap[par]} < ${heap[pos]}, so swap positions ${pos} and ${par}. Child moves up.`,
          });

          pos = par;
        } else {
          this.steps.push({
            data: [...heap, ...new Array(Math.max(0, data.length - heap.length)).fill(0)],
            highlights: [
              { index: pos, color: COLORS.heapified, label: `${heap[pos]}` },
            ],
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `No swap needed: ${heap[pos]} >= ${heap[par]}. Heap property satisfied. Sift-up complete.`,
          });
          break;
        }
      }

      if (pos === 0) {
        this.steps.push({
          data: [...heap, ...new Array(Math.max(0, data.length - heap.length)).fill(0)],
          highlights: [
            { index: 0, color: COLORS.heapified, label: `min=${heap[0]}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Sift-up reached root. Heap property restored. Min = ${heap[0]}.`,
        });
      }
    }

    // EXTRACT-MIN phase: sift-down
    const extractCount = Math.min(3, heap.length);
    for (let e = 0; e < extractCount; e++) {
      if (heap.length === 0) break;

      const minVal = heap[0];
      extracted.push(minVal);

      this.steps.push({
        data: [...heap, ...new Array(Math.max(0, data.length - heap.length)).fill(0)],
        highlights: [
          { index: 0, color: COLORS.extracting, label: `min=${minVal}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `EXTRACT-MIN: removing ${minVal} from root. Moving last element ${heap[heap.length - 1]} to root.`,
      });

      heap[0] = heap[heap.length - 1];
      heap.pop();

      if (heap.length === 0) {
        this.steps.push({
          data: new Array(data.length).fill(0),
          highlights: [],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Heap is now empty. Extracted: [${extracted.join(', ')}].`,
        });
        continue;
      }

      this.steps.push({
        data: [...heap, ...new Array(Math.max(0, data.length - heap.length)).fill(0)],
        highlights: [
          { index: 0, color: COLORS.sifting, label: `${heap[0]}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Moved ${heap[0]} to root. Starting sift-down to restore heap property.`,
      });

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
            data: [...heap, ...new Array(Math.max(0, data.length - heap.length)).fill(0)],
            highlights: [
              { index: pos, color: COLORS.heapified, label: `${heap[pos]}` },
            ],
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `Sift-down: ${heap[pos]} at index ${pos} is smaller than both children. Heap property restored.`,
          });
          break;
        }

        const childHighlights: { index: number; color: string; label?: string }[] = [
          { index: pos, color: COLORS.comparing, label: `${heap[pos]}` },
        ];
        const compPairs: [number, number][] = [];
        if (l < heap.length) {
          childHighlights.push({ index: l, color: COLORS.comparing, label: `L:${heap[l]}` });
          compPairs.push([pos, l]);
        }
        if (r < heap.length) {
          childHighlights.push({ index: r, color: COLORS.comparing, label: `R:${heap[r]}` });
          compPairs.push([pos, r]);
        }

        this.steps.push({
          data: [...heap, ...new Array(Math.max(0, data.length - heap.length)).fill(0)],
          highlights: childHighlights,
          comparisons: compPairs,
          swaps: [],
          sorted: [],
          stepDescription: `Sift-down: comparing ${heap[pos]} with children.${l < heap.length ? ` Left=${heap[l]}` : ''}${r < heap.length ? ` Right=${heap[r]}` : ''}. Smallest child at index ${smallest}.`,
        });

        const temp = heap[pos];
        heap[pos] = heap[smallest];
        heap[smallest] = temp;

        this.steps.push({
          data: [...heap, ...new Array(Math.max(0, data.length - heap.length)).fill(0)],
          highlights: [
            { index: pos, color: COLORS.swapping, label: `${heap[pos]}` },
            { index: smallest, color: COLORS.swapping, label: `${heap[smallest]}` },
          ],
          comparisons: [],
          swaps: [[pos, smallest]],
          sorted: [],
          stepDescription: `Swap ${heap[pos]} and ${heap[smallest]} at indices ${pos} and ${smallest}. Continue sifting down.`,
        });

        pos = smallest;
      }
    }

    this.steps.push({
      data: [...heap, ...new Array(Math.max(0, data.length - heap.length)).fill(0)],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: heapIndices(),
      stepDescription: `Heap operations complete. Extracted in order: [${extracted.join(', ')}]. Insert: O(log n), Extract-min: O(log n).`,
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
