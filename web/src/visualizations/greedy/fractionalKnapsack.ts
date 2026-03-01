import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { full: '#22c55e', partial: '#eab308', skipped: '#94a3b8', ratio: '#3b82f6' };

export class FractionalKnapsackVisualization implements AlgorithmVisualization {
  name = 'Fractional Knapsack';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const n = Math.min(data.length, 8);
    const values = data.slice(0, n);
    const weights = data.slice(0, n).map(v => Math.max(1, Math.floor(v / 2)));
    const capacity = Math.floor(weights.reduce((a, b) => a + b, 0) * 0.6);

    // Sort by value/weight ratio
    const items = values.map((v, i) => ({ value: v, weight: weights[i], ratio: v / weights[i], idx: i }));
    items.sort((a, b) => b.ratio - a.ratio);

    const ratios = items.map(item => Math.round(item.ratio * 10));
    this.steps.push({
      data: ratios,
      highlights: items.map((_, i) => ({ index: i, color: COLORS.ratio, label: `r=${items[i].ratio.toFixed(1)}` })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Fractional Knapsack: capacity=${capacity}, ${n} items sorted by value/weight ratio`,
    });

    let remaining = capacity;
    let totalValue = 0;
    const taken: number[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (remaining <= 0) {
        this.steps.push({
          data: ratios,
          highlights: [{ index: i, color: COLORS.skipped, label: 'skip' }],
          comparisons: [],
          swaps: [],
          sorted: [...taken],
          stepDescription: `Knapsack full. Skip item ${item.idx} (v=${item.value}, w=${item.weight})`,
        });
        continue;
      }

      if (item.weight <= remaining) {
        remaining -= item.weight;
        totalValue += item.value;
        taken.push(i);
        this.steps.push({
          data: ratios,
          highlights: [{ index: i, color: COLORS.full, label: '100%' }],
          comparisons: [],
          swaps: [],
          sorted: [...taken],
          stepDescription: `Take 100% of item ${item.idx} (v=${item.value}, w=${item.weight}). Remaining: ${remaining}. Value: ${totalValue}`,
        });
      } else {
        const fraction = remaining / item.weight;
        totalValue += item.value * fraction;
        taken.push(i);
        this.steps.push({
          data: ratios,
          highlights: [{ index: i, color: COLORS.partial, label: `${(fraction * 100).toFixed(0)}%` }],
          comparisons: [],
          swaps: [],
          sorted: [...taken],
          stepDescription: `Take ${(fraction * 100).toFixed(1)}% of item ${item.idx} (v=${(item.value * fraction).toFixed(1)}). Total: ${totalValue.toFixed(1)}`,
        });
        remaining = 0;
      }
    }

    this.steps.push({
      data: ratios,
      highlights: taken.map(t => ({ index: t, color: COLORS.full })),
      comparisons: [],
      swaps: [],
      sorted: [...taken],
      stepDescription: `Optimal value: ${totalValue.toFixed(1)} with capacity ${capacity}`,
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
