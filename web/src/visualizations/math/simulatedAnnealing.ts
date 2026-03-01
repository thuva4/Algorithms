import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  current: '#3b82f6',
  best: '#22c55e',
  accepted: '#eab308',
  rejected: '#ef4444',
  cooling: '#8b5cf6',
};

export class SimulatedAnnealingVisualization implements AlgorithmVisualization {
  name = 'Simulated Annealing';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Optimize: find minimum of a function represented by the data array
    // Treat data as a "landscape" and find the index of the minimum value
    const landscape = data.slice(0, Math.min(data.length, 20)).map((d) => Math.abs(d) % 100);
    while (landscape.length < 10) landscape.push(Math.floor(Math.random() * 100));

    const n = landscape.length;
    let temperature = 100.0;
    const coolingRate = 0.85;
    const minTemp = 1.0;

    // Seed random
    let seed = data.reduce((a, b) => a + Math.abs(b), 42);
    function seededRandom() {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    }

    let currentIdx = Math.floor(seededRandom() * n);
    let currentVal = landscape[currentIdx];
    let bestIdx = currentIdx;
    let bestVal = currentVal;

    this.steps.push({
      data: [...landscape],
      highlights: landscape.map((v, i) => ({
        index: i,
        color: i === currentIdx ? COLORS.current : '#94a3b8',
        label: `${v}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Simulated Annealing: find minimum in landscape. Start at index ${currentIdx} (value ${currentVal}), T=${temperature}`,
    });

    let iteration = 0;
    while (temperature > minTemp && iteration < 30) {
      // Generate neighbor (random adjacent position)
      const delta = seededRandom() < 0.5 ? -1 : 1;
      let neighborIdx = (currentIdx + delta + n) % n;
      // Sometimes jump further at high temperatures
      if (temperature > 50 && seededRandom() > 0.5) {
        neighborIdx = Math.floor(seededRandom() * n);
      }
      const neighborVal = landscape[neighborIdx];

      const diff = neighborVal - currentVal;
      const acceptProb = diff < 0 ? 1.0 : Math.exp(-diff / temperature);
      const accepted = seededRandom() < acceptProb;

      if (accepted) {
        currentIdx = neighborIdx;
        currentVal = neighborVal;

        if (currentVal < bestVal) {
          bestVal = currentVal;
          bestIdx = currentIdx;
        }

        this.steps.push({
          data: [...landscape],
          highlights: landscape.map((v, i) => {
            if (i === currentIdx) return { index: i, color: COLORS.accepted, label: `curr=${v}` };
            if (i === bestIdx && bestIdx !== currentIdx) return { index: i, color: COLORS.best, label: `best=${v}` };
            return { index: i, color: '#94a3b8', label: `${v}` };
          }),
          comparisons: [],
          swaps: [],
          sorted: [bestIdx],
          stepDescription: `Iter ${iteration}: move to idx ${neighborIdx} (val ${neighborVal}). ${diff < 0 ? 'Better!' : `Worse by ${diff}, accepted (prob ${(acceptProb * 100).toFixed(1)}%)`}. T=${temperature.toFixed(1)}`,
        });
      } else {
        this.steps.push({
          data: [...landscape],
          highlights: landscape.map((v, i) => {
            if (i === currentIdx) return { index: i, color: COLORS.current, label: `stay=${v}` };
            if (i === neighborIdx) return { index: i, color: COLORS.rejected, label: `rej=${v}` };
            if (i === bestIdx && bestIdx !== currentIdx) return { index: i, color: COLORS.best, label: `best=${v}` };
            return { index: i, color: '#94a3b8', label: `${v}` };
          }),
          comparisons: [],
          swaps: [],
          sorted: [bestIdx],
          stepDescription: `Iter ${iteration}: reject idx ${neighborIdx} (val ${neighborVal}, worse by ${diff}, prob ${(acceptProb * 100).toFixed(1)}%). Stay at ${currentIdx}. T=${temperature.toFixed(1)}`,
        });
      }

      temperature *= coolingRate;
      iteration++;

      // Show cooling step periodically
      if (iteration % 5 === 0) {
        this.steps.push({
          data: [...landscape],
          highlights: landscape.map((v, i) => {
            if (i === currentIdx) return { index: i, color: COLORS.current, label: `curr=${v}` };
            if (i === bestIdx) return { index: i, color: COLORS.best, label: `best=${v}` };
            return { index: i, color: '#94a3b8', label: `${v}` };
          }),
          comparisons: [],
          swaps: [],
          sorted: [bestIdx],
          stepDescription: `Temperature cooled to ${temperature.toFixed(2)}. Current: idx ${currentIdx} (${currentVal}), Best: idx ${bestIdx} (${bestVal})`,
        });
      }
    }

    // Final result
    const actualMin = Math.min(...landscape);
    const actualMinIdx = landscape.indexOf(actualMin);

    this.steps.push({
      data: [...landscape],
      highlights: landscape.map((v, i) => {
        if (i === bestIdx) return { index: i, color: COLORS.best, label: `BEST=${v}` };
        if (i === actualMinIdx && actualMinIdx !== bestIdx) return { index: i, color: COLORS.cooling, label: `TRUE MIN=${v}` };
        return { index: i, color: '#94a3b8', label: `${v}` };
      }),
      comparisons: [],
      swaps: [],
      sorted: [bestIdx],
      stepDescription: `Annealing complete. Best found: ${bestVal} at idx ${bestIdx}. ${bestVal === actualMin ? 'Found global minimum!' : `Global min is ${actualMin} at idx ${actualMinIdx}`}`,
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
