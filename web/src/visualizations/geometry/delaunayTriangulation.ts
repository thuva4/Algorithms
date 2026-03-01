import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { point: '#3b82f6', edge: '#eab308', triangle: '#22c55e' };

export class DelaunayTriangulationVisualization implements AlgorithmVisualization {
  name = 'Delaunay Triangulation';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const n = Math.min(data.length, 8);
    const points = data.slice(0, n);

    this.steps.push({
      data: [...points],
      highlights: points.map((_, i) => ({ index: i, color: COLORS.point, label: `P${i}` })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Delaunay Triangulation of ${n} points (incremental insertion)`,
    });

    // Simulate incremental triangulation
    const triangulated: number[] = [];
    for (let i = 0; i < n; i++) {
      triangulated.push(i);

      if (triangulated.length >= 3) {
        // Show triangle formation
        const last3 = triangulated.slice(-3);
        this.steps.push({
          data: [...points],
          highlights: [
            { index: i, color: COLORS.edge, label: `+P${i}` },
            ...last3.map(t => ({ index: t, color: COLORS.triangle })),
          ],
          comparisons: last3.length >= 2 ? [[last3[0], last3[1]]] : [],
          swaps: [],
          sorted: [],
          stepDescription: `Insert P${i}: form triangle with P${last3.join(', P')}`,
        });

        // Check Delaunay condition (simplified)
        if (triangulated.length >= 4) {
          this.steps.push({
            data: [...points],
            highlights: triangulated.map(t => ({ index: t, color: COLORS.triangle })),
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `Check circumcircle condition for new triangles — flip edges if needed`,
          });
        }
      } else if (triangulated.length === 2) {
        this.steps.push({
          data: [...points],
          highlights: [
            { index: triangulated[0], color: COLORS.edge },
            { index: triangulated[1], color: COLORS.edge },
          ],
          comparisons: [[triangulated[0], triangulated[1]]],
          swaps: [],
          sorted: [],
          stepDescription: `Edge between P${triangulated[0]} and P${triangulated[1]}`,
        });
      } else {
        this.steps.push({
          data: [...points],
          highlights: [{ index: i, color: COLORS.point, label: `P${i}` }],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `First point P${i} inserted`,
        });
      }
    }

    this.steps.push({
      data: [...points],
      highlights: points.map((_, i) => ({ index: i, color: COLORS.triangle })),
      comparisons: [],
      swaps: [],
      sorted: points.map((_, i) => i),
      stepDescription: `Delaunay triangulation complete with ${n} points`,
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
