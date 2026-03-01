import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { max: '#3b82f6', min: '#ef4444', chosen: '#22c55e', pruned: '#94a3b8', evaluating: '#eab308' };

export class MinMaxAbPruningVisualization implements AlgorithmVisualization {
  name = 'Alpha-Beta Pruning';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const leaves = data.length >= 8 ? data.slice(0, 8) : [3, 5, 2, 9, 12, 5, 23, 2];

    this.steps.push({
      data: [...leaves],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Alpha-Beta Pruning on game tree with leaves [${leaves.join(', ')}]`,
    });

    this.alphaBeta(leaves, 0, leaves.length - 1, true, -Infinity, Infinity, 0);
    return this.steps[0];
  }

  private alphaBeta(leaves: number[], lo: number, hi: number, isMax: boolean, alpha: number, beta: number, depth: number): number {
    if (lo === hi) {
      this.steps.push({
        data: [...leaves],
        highlights: [{ index: lo, color: COLORS.evaluating, label: `${leaves[lo]}` }],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Leaf ${lo}: value=${leaves[lo]}, alpha=${alpha === -Infinity ? '-inf' : alpha}, beta=${beta === Infinity ? 'inf' : beta}`,
      });
      return leaves[lo];
    }

    const mid = Math.floor((lo + hi) / 2);

    if (isMax) {
      let val = -Infinity;
      const left = this.alphaBeta(leaves, lo, mid, false, alpha, beta, depth + 1);
      val = Math.max(val, left);
      alpha = Math.max(alpha, val);

      if (alpha >= beta) {
        this.steps.push({
          data: [...leaves],
          highlights: Array.from({ length: hi - mid }, (_, i) => ({
            index: mid + 1 + i,
            color: COLORS.pruned,
            label: 'pruned',
          })),
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `PRUNE: alpha(${alpha}) >= beta(${beta}), skip right subtree [${mid + 1}-${hi}]`,
        });
        return val;
      }

      const right = this.alphaBeta(leaves, mid + 1, hi, false, alpha, beta, depth + 1);
      val = Math.max(val, right);

      this.steps.push({
        data: [...leaves],
        highlights: [{ index: val === left ? lo : mid + 1, color: COLORS.chosen, label: `MAX=${val}` }],
        comparisons: [[lo, hi]],
        swaps: [],
        sorted: [],
        stepDescription: `MAX node [${lo}-${hi}]: max(${left},${right})=${val}`,
      });
      return val;
    } else {
      let val = Infinity;
      const left = this.alphaBeta(leaves, lo, mid, true, alpha, beta, depth + 1);
      val = Math.min(val, left);
      beta = Math.min(beta, val);

      if (alpha >= beta) {
        this.steps.push({
          data: [...leaves],
          highlights: Array.from({ length: hi - mid }, (_, i) => ({
            index: mid + 1 + i,
            color: COLORS.pruned,
            label: 'pruned',
          })),
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `PRUNE: alpha(${alpha}) >= beta(${beta}), skip right subtree [${mid + 1}-${hi}]`,
        });
        return val;
      }

      const right = this.alphaBeta(leaves, mid + 1, hi, true, alpha, beta, depth + 1);
      val = Math.min(val, right);

      this.steps.push({
        data: [...leaves],
        highlights: [{ index: val === left ? lo : mid + 1, color: COLORS.chosen, label: `MIN=${val}` }],
        comparisons: [[lo, hi]],
        swaps: [],
        sorted: [],
        stepDescription: `MIN node [${lo}-${hi}]: min(${left},${right})=${val}`,
      });
      return val;
    }
  }

  step(): VisualizationState | null {
    this.currentStepIndex++;
    return this.currentStepIndex < this.steps.length ? this.steps[this.currentStepIndex] : null;
  }
  reset(): void { this.currentStepIndex = -1; }
  getStepCount(): number { return this.steps.length; }
  getCurrentStep(): number { return this.currentStepIndex; }
}
