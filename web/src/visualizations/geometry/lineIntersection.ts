import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { line1: '#3b82f6', line2: '#ef4444', intersection: '#22c55e', checking: '#eab308' };

export class LineIntersectionVisualization implements AlgorithmVisualization {
  name = 'Line Intersection';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    // Represent line segments as endpoints: [x1, y1, x2, y2, x3, y3, x4, y4]
    const vals = data.slice(0, 8).map(v => Math.abs(v) % 100);
    while (vals.length < 8) vals.push(Math.floor(Math.random() * 100));

    this.steps.push({
      data: vals,
      highlights: [
        { index: 0, color: COLORS.line1, label: 'L1.x1' },
        { index: 1, color: COLORS.line1, label: 'L1.y1' },
        { index: 2, color: COLORS.line1, label: 'L1.x2' },
        { index: 3, color: COLORS.line1, label: 'L1.y2' },
        { index: 4, color: COLORS.line2, label: 'L2.x1' },
        { index: 5, color: COLORS.line2, label: 'L2.y1' },
        { index: 6, color: COLORS.line2, label: 'L2.x2' },
        { index: 7, color: COLORS.line2, label: 'L2.y2' },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Line intersection: L1(${vals[0]},${vals[1]})-(${vals[2]},${vals[3]}) and L2(${vals[4]},${vals[5]})-(${vals[6]},${vals[7]})`,
    });

    // Cross product approach
    const d1x = vals[2] - vals[0], d1y = vals[3] - vals[1];
    const d2x = vals[6] - vals[4], d2y = vals[7] - vals[5];
    const cross = d1x * d2y - d1y * d2x;

    this.steps.push({
      data: [d1x, d1y, d2x, d2y, cross, 0, 0, 0],
      highlights: [
        { index: 0, color: COLORS.line1, label: `dx1=${d1x}` },
        { index: 1, color: COLORS.line1, label: `dy1=${d1y}` },
        { index: 2, color: COLORS.line2, label: `dx2=${d2x}` },
        { index: 3, color: COLORS.line2, label: `dy2=${d2y}` },
        { index: 4, color: COLORS.checking, label: `cross=${cross}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Direction vectors: d1=(${d1x},${d1y}), d2=(${d2x},${d2y}). Cross product = ${cross}`,
    });

    if (cross === 0) {
      this.steps.push({
        data: vals,
        highlights: vals.map((_, i) => ({ index: i, color: COLORS.checking })),
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Lines are parallel (cross product = 0). No unique intersection.`,
      });
    } else {
      const dx = vals[4] - vals[0], dy = vals[5] - vals[1];
      const t = (dx * d2y - dy * d2x) / cross;
      const ix = vals[0] + t * d1x;
      const iy = vals[1] + t * d1y;

      this.steps.push({
        data: [Math.round(ix), Math.round(iy), ...vals.slice(2)],
        highlights: [
          { index: 0, color: COLORS.intersection, label: `x=${ix.toFixed(1)}` },
          { index: 1, color: COLORS.intersection, label: `y=${iy.toFixed(1)}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [0, 1],
        stepDescription: `Parameter t = ${t.toFixed(3)}. Intersection at (${ix.toFixed(1)}, ${iy.toFixed(1)})`,
      });
    }

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
