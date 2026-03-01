import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { site: '#3b82f6', computing: '#eab308', assigned: '#22c55e', boundary: '#8b5cf6' };

export class VoronoiDiagramVisualization implements AlgorithmVisualization {
  name = 'Voronoi Diagram';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const n = Math.min(data.length, 8);
    const sites = data.slice(0, n);

    this.steps.push({
      data: [...sites],
      highlights: sites.map((_, i) => ({ index: i, color: COLORS.site, label: `S${i}` })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Voronoi diagram: partition space into regions closest to each of ${n} sites`,
    });

    // Show nearest-site computation for sample points
    const samplePoints = sites.map((_, i) => Math.floor((sites[i] + sites[(i + 1) % n]) / 2));

    for (let p = 0; p < Math.min(samplePoints.length, 6); p++) {
      const sample = samplePoints[p];
      let nearest = 0;
      let minDist = Math.abs(sample - sites[0]);

      for (let s = 1; s < n; s++) {
        const dist = Math.abs(sample - sites[s]);
        this.steps.push({
          data: [...sites],
          highlights: [
            { index: s, color: COLORS.computing, label: `d=${dist}` },
            { index: nearest, color: COLORS.assigned, label: `best=${minDist}` },
          ],
          comparisons: [[s, nearest]],
          swaps: [],
          sorted: [],
          stepDescription: `Sample point ${sample}: distance to S${s}=${dist}, current nearest S${nearest}=${minDist}`,
        });

        if (dist < minDist) {
          minDist = dist;
          nearest = s;
        }
      }

      this.steps.push({
        data: [...sites],
        highlights: [{ index: nearest, color: COLORS.assigned, label: `owns ${sample}` }],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Point ${sample} belongs to Voronoi cell of site S${nearest}`,
      });
    }

    // Show boundaries
    const sorted = [...sites].sort((a, b) => a - b);
    const boundaries: number[] = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      boundaries.push(Math.floor((sorted[i] + sorted[i + 1]) / 2));
    }

    this.steps.push({
      data: [...sites],
      highlights: sites.map((_, i) => ({ index: i, color: COLORS.assigned })),
      comparisons: [],
      swaps: [],
      sorted: sites.map((_, i) => i),
      stepDescription: `Voronoi diagram complete. Boundaries at midpoints between sorted sites.`,
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
