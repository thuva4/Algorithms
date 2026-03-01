import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { polygon: '#3b82f6', point: '#eab308', inside: '#22c55e', outside: '#ef4444', ray: '#8b5cf6' };

export class PointInPolygonVisualization implements AlgorithmVisualization {
  name = 'Point in Polygon';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    // polygon vertices as values, test point
    const n = Math.max(4, Math.min(data.length - 1, 8));
    const polygon = data.slice(0, n);
    const testPoint = data[n] || Math.floor((Math.min(...polygon) + Math.max(...polygon)) / 2);

    const display = [...polygon, testPoint];
    this.steps.push({
      data: display,
      highlights: [
        ...polygon.map((_, i) => ({ index: i, color: COLORS.polygon, label: `V${i}` })),
        { index: n, color: COLORS.point, label: 'P' },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Ray casting: is point ${testPoint} inside polygon? Cast ray rightward and count crossings.`,
    });

    let crossings = 0;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const vi = polygon[i], vj = polygon[j];
      const crosses = (vi <= testPoint && vj > testPoint) || (vj <= testPoint && vi > testPoint);

      this.steps.push({
        data: display,
        highlights: [
          { index: i, color: COLORS.ray, label: `V${i}` },
          { index: j, color: COLORS.ray, label: `V${j}` },
          { index: n, color: COLORS.point, label: 'P' },
        ],
        comparisons: [[i, j]],
        swaps: [],
        sorted: [],
        stepDescription: `Edge V${i}(${vi})-V${j}(${vj}): ray ${crosses ? 'CROSSES' : 'misses'}. Crossings: ${crossings + (crosses ? 1 : 0)}`,
      });

      if (crosses) crossings++;
    }

    const inside = crossings % 2 === 1;
    this.steps.push({
      data: display,
      highlights: [
        { index: n, color: inside ? COLORS.inside : COLORS.outside, label: inside ? 'Inside' : 'Outside' },
      ],
      comparisons: [],
      swaps: [],
      sorted: inside ? [n] : [],
      stepDescription: `${crossings} crossing(s) — ${crossings} is ${inside ? 'odd' : 'even'}: point is ${inside ? 'INSIDE' : 'OUTSIDE'}`,
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
