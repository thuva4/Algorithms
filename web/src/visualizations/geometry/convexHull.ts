import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { hull: '#22c55e', checking: '#eab308', rejected: '#94a3b8', pivot: '#ef4444' };

export class ConvexHullVisualization implements AlgorithmVisualization {
  name = 'Convex Hull (Graham Scan)';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const n = Math.min(data.length, 12);
    const points = data.slice(0, n);

    this.steps.push({
      data: [...points],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Graham Scan: find convex hull of ${n} points`,
    });

    // Find lowest point (pivot)
    let pivotIdx = 0;
    for (let i = 1; i < n; i++) {
      if (points[i] < points[pivotIdx]) pivotIdx = i;
    }

    this.steps.push({
      data: [...points],
      highlights: [{ index: pivotIdx, color: COLORS.pivot, label: 'pivot' }],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Pivot point: index ${pivotIdx} (lowest value ${points[pivotIdx]})`,
    });

    // Sort by angle (simplified: sort by value relative to pivot)
    const indices = Array.from({ length: n }, (_, i) => i)
      .filter(i => i !== pivotIdx)
      .sort((a, b) => points[a] - points[b]);
    indices.unshift(pivotIdx);

    const sorted = indices.map(i => points[i]);
    this.steps.push({
      data: sorted,
      highlights: sorted.map((_, i) => ({ index: i, color: COLORS.checking })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Points sorted by polar angle relative to pivot`,
    });

    // Build hull using stack
    const stack: number[] = [0, 1];
    for (let i = 2; i < n; i++) {
      while (stack.length > 1) {
        const top = stack[stack.length - 1];
        const nextToTop = stack[stack.length - 2];
        // Cross product check (simplified with values)
        if ((sorted[top] - sorted[nextToTop]) * (sorted[i] - sorted[nextToTop]) >= 0) {
          break;
        }
        const removed = stack.pop()!;
        this.steps.push({
          data: sorted,
          highlights: [
            { index: removed, color: COLORS.rejected, label: 'pop' },
            ...stack.map(s => ({ index: s, color: COLORS.hull })),
          ],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Right turn detected: remove point ${removed} from hull`,
        });
      }

      stack.push(i);
      this.steps.push({
        data: sorted,
        highlights: [
          { index: i, color: COLORS.checking, label: 'add' },
          ...stack.map(s => ({ index: s, color: COLORS.hull })),
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Add point ${i} to hull. Hull size: ${stack.length}`,
      });
    }

    this.steps.push({
      data: sorted,
      highlights: stack.map(s => ({ index: s, color: COLORS.hull, label: 'H' })),
      comparisons: [],
      swaps: [],
      sorted: [...stack],
      stepDescription: `Convex hull complete with ${stack.length} points`,
    });

    return this.steps[0];
  }

  step(): VisualizationState | null {
    this.currentStepIndex++;
    return this.currentStepIndex < this.steps.length ? this.steps[this.currentStepIndex] : null;
  }
  reset(): void { this.currentStepIndex = -1; }
  getStepCount(): number { return this.steps.length; }
  getCurrentStep(): number { return this.currentStepIndex; }
}
