import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  active: '#3b82f6',
  eliminated: '#ef4444',
  survivor: '#22c55e',
  counting: '#eab308',
};

export class JosephusProblemVisualization implements AlgorithmVisualization {
  name = 'Josephus Problem';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = Math.min(Math.max(data.length, 3), 15);
    const k = Math.max(2, (data[0] % 4) + 2); // step size 2-5

    // Build circle: values represent person IDs (1-indexed)
    const circle: number[] = [];
    for (let i = 1; i <= n; i++) circle.push(i);

    const displayArr = [...circle];
    const eliminated: number[] = [];

    this.steps.push({
      data: [...displayArr],
      highlights: displayArr.map((_, i) => ({ index: i, color: COLORS.active, label: `P${displayArr[i]}` })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Josephus Problem: ${n} people in a circle, eliminate every ${k}-th person`,
    });

    const alive = [...circle];
    let idx = 0;

    while (alive.length > 1) {
      // Count k positions forward
      idx = (idx + k - 1) % alive.length;
      const person = alive[idx];

      // Show counting step
      const countHighlights = alive.map((p) => {
        const origIdx = displayArr.indexOf(p);
        if (p === person) return { index: origIdx, color: COLORS.eliminated, label: `P${p} (out!)` };
        return { index: origIdx, color: COLORS.active, label: `P${p}` };
      });
      for (const e of eliminated) {
        const origIdx = displayArr.indexOf(e);
        countHighlights.push({ index: origIdx, color: '#6b7280', label: `P${e} X` });
      }

      eliminated.push(person);
      alive.splice(idx, 1);
      if (idx >= alive.length) idx = 0;

      this.steps.push({
        data: [...displayArr],
        highlights: countHighlights,
        comparisons: [],
        swaps: [],
        sorted: eliminated.map((e) => displayArr.indexOf(e)),
        stepDescription: `Counted ${k} positions: eliminate person ${person} (${eliminated.length} of ${n - 1} eliminations)`,
      });
    }

    // Survivor
    const survivor = alive[0];
    const survivorIdx = displayArr.indexOf(survivor);
    const finalHighlights = displayArr.map((p, i) => {
      if (p === survivor) return { index: i, color: COLORS.survivor, label: `P${p} SURVIVES` };
      return { index: i, color: '#6b7280', label: `P${p} X` };
    });

    this.steps.push({
      data: [...displayArr],
      highlights: finalHighlights,
      comparisons: [],
      swaps: [],
      sorted: [survivorIdx],
      stepDescription: `Person ${survivor} is the last survivor! (position ${survivorIdx + 1} in circle)`,
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
