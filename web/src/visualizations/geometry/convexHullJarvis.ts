import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { hull: '#22c55e', checking: '#eab308', current: '#3b82f6' };

export class ConvexHullJarvisVisualization implements AlgorithmVisualization {
  name = 'Convex Hull (Jarvis March)';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const n = Math.min(data.length, 10);
    const points = data.slice(0, n);

    this.steps.push({
      data: [...points],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Jarvis March (Gift Wrapping): find convex hull of ${n} points`,
    });

    // Start from leftmost (smallest value)
    let start = 0;
    for (let i = 1; i < n; i++) {
      if (points[i] < points[start]) start = i;
    }

    const hull: number[] = [];
    let current = start;
    const visited = new Set<number>();

    do {
      hull.push(current);
      visited.add(current);

      this.steps.push({
        data: [...points],
        highlights: [
          { index: current, color: COLORS.current, label: `from ${current}` },
          ...hull.slice(0, -1).map(h => ({ index: h, color: COLORS.hull })),
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Current hull point: ${current}. Finding next counterclockwise point.`,
      });

      let next = (current + 1) % n;
      for (let i = 0; i < n; i++) {
        if (i === current) continue;
        // Simplified: choose the point that makes the smallest "turn"
        // Using value comparison as proxy for angle
        this.steps.push({
          data: [...points],
          highlights: [
            { index: current, color: COLORS.current },
            { index: i, color: COLORS.checking, label: `check ${i}` },
            { index: next, color: COLORS.hull, label: `best ${next}` },
          ],
          comparisons: [[current, i]],
          swaps: [],
          sorted: [],
          stepDescription: `Compare candidate ${i} (val=${points[i]}) vs current best ${next} (val=${points[next]})`,
        });

        // Cross product simplified
        const cross = (points[next] - points[current]) * (points[i] - points[current]);
        if (next === current || cross > 0 || (cross === 0 && Math.abs(points[i] - points[current]) > Math.abs(points[next] - points[current]))) {
          next = i;
        }
      }

      current = next;
    } while (current !== start && hull.length < n);

    this.steps.push({
      data: [...points],
      highlights: hull.map(h => ({ index: h, color: COLORS.hull, label: 'H' })),
      comparisons: [],
      swaps: [],
      sorted: [...hull],
      stepDescription: `Convex hull: [${hull.join(', ')}], ${hull.length} points`,
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
