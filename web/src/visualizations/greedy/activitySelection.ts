import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { selected: '#22c55e', checking: '#eab308', rejected: '#ef4444' };

export class ActivitySelectionVisualization implements AlgorithmVisualization {
  name = 'Activity Selection';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    // Represent finish times (sorted)
    const finishTimes = [...data].sort((a, b) => a - b);
    const n = finishTimes.length;
    // Start times: finish - random duration
    const startTimes = finishTimes.map(f => Math.max(0, f - Math.floor(Math.random() * 5) - 1));

    this.steps.push({
      data: finishTimes,
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Activity Selection: ${n} activities sorted by finish time. Select maximum non-overlapping set.`,
    });

    const selected: number[] = [0]; // Always select first activity
    let lastFinish = finishTimes[0];

    this.steps.push({
      data: finishTimes,
      highlights: [{ index: 0, color: COLORS.selected, label: `A0 [${startTimes[0]},${finishTimes[0]})` }],
      comparisons: [],
      swaps: [],
      sorted: [0],
      stepDescription: `Select activity 0 (finish=${finishTimes[0]})`,
    });

    for (let i = 1; i < n; i++) {
      this.steps.push({
        data: finishTimes,
        highlights: [
          { index: i, color: COLORS.checking, label: `start=${startTimes[i]}` },
          ...selected.map(s => ({ index: s, color: COLORS.selected })),
        ],
        comparisons: [],
        swaps: [],
        sorted: [...selected],
        stepDescription: `Activity ${i}: start=${startTimes[i]}, last finish=${lastFinish}. ${startTimes[i] >= lastFinish ? 'Compatible!' : 'Overlaps!'}`,
      });

      if (startTimes[i] >= lastFinish) {
        selected.push(i);
        lastFinish = finishTimes[i];
        this.steps.push({
          data: finishTimes,
          highlights: [
            { index: i, color: COLORS.selected, label: 'Selected' },
            ...selected.slice(0, -1).map(s => ({ index: s, color: COLORS.selected })),
          ],
          comparisons: [],
          swaps: [],
          sorted: [...selected],
          stepDescription: `Selected activity ${i}. Total selected: ${selected.length}`,
        });
      } else {
        this.steps.push({
          data: finishTimes,
          highlights: [{ index: i, color: COLORS.rejected, label: 'Reject' }],
          comparisons: [],
          swaps: [],
          sorted: [...selected],
          stepDescription: `Rejected activity ${i} (overlaps)`,
        });
      }
    }

    this.steps.push({
      data: finishTimes,
      highlights: selected.map(s => ({ index: s, color: COLORS.selected, label: `A${s}` })),
      comparisons: [],
      swaps: [],
      sorted: [...selected],
      stepDescription: `Maximum ${selected.length} non-overlapping activities selected`,
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
