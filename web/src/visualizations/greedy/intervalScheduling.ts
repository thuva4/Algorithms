import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { selected: '#22c55e', checking: '#eab308', rejected: '#ef4444', lastEnd: '#8b5cf6' };

export class IntervalSchedulingVisualization implements AlgorithmVisualization {
  name = 'Interval Scheduling';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = Math.min(data.length, 12);
    // Generate intervals: use data values as end times, derive start times
    const rawEnds = data.slice(0, n).map(v => Math.abs(v) + 1);
    const intervals: { start: number; end: number; originalIdx: number }[] = rawEnds.map((end, i) => ({
      start: Math.max(0, end - Math.floor(Math.random() * Math.max(3, Math.floor(end / 2))) - 1),
      end,
      originalIdx: i,
    }));

    // Sort by end time (greedy strategy)
    intervals.sort((a, b) => a.end - b.end);

    const endTimes = intervals.map(iv => iv.end);

    // Step 0: Show all intervals sorted by end time
    this.steps.push({
      data: endTimes,
      highlights: intervals.map((iv, i) => ({
        index: i,
        color: COLORS.checking,
        label: `[${iv.start},${iv.end})`,
      })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Interval Scheduling: ${n} intervals sorted by end time. Greedily select non-overlapping intervals.`,
    });

    // Greedy selection
    const selected: number[] = [];
    let lastEnd = -1;

    for (let i = 0; i < intervals.length; i++) {
      const iv = intervals[i];

      // Show checking this interval
      this.steps.push({
        data: endTimes,
        highlights: [
          { index: i, color: COLORS.checking, label: `[${iv.start},${iv.end})` },
          ...selected.map(s => ({ index: s, color: COLORS.selected })),
        ],
        comparisons: [],
        swaps: [],
        sorted: [...selected],
        stepDescription: `Check interval ${i}: [${iv.start}, ${iv.end}). Start=${iv.start} vs lastEnd=${lastEnd}. ${iv.start >= lastEnd ? 'No overlap!' : 'Overlaps!'}`,
      });

      if (iv.start >= lastEnd) {
        // Select this interval
        selected.push(i);
        lastEnd = iv.end;

        this.steps.push({
          data: endTimes,
          highlights: [
            { index: i, color: COLORS.selected, label: 'Selected' },
            ...selected.slice(0, -1).map(s => ({ index: s, color: COLORS.selected })),
          ],
          comparisons: [],
          swaps: [],
          sorted: [...selected],
          stepDescription: `Selected interval ${i}: [${iv.start}, ${iv.end}). Last end updated to ${lastEnd}. Total selected: ${selected.length}`,
        });
      } else {
        // Reject this interval
        this.steps.push({
          data: endTimes,
          highlights: [
            { index: i, color: COLORS.rejected, label: 'Reject' },
            ...selected.map(s => ({ index: s, color: COLORS.selected })),
          ],
          comparisons: [],
          swaps: [],
          sorted: [...selected],
          stepDescription: `Rejected interval ${i}: [${iv.start}, ${iv.end}) overlaps with last selected (end=${lastEnd})`,
        });
      }
    }

    // Final result
    this.steps.push({
      data: endTimes,
      highlights: selected.map(s => ({
        index: s,
        color: COLORS.selected,
        label: `[${intervals[s].start},${intervals[s].end})`,
      })),
      comparisons: [],
      swaps: [],
      sorted: [...selected],
      stepDescription: `Maximum ${selected.length} non-overlapping intervals selected out of ${n} total`,
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
