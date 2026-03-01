import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  stream: '#3b82f6',
  reservoir: '#22c55e',
  replaced: '#ef4444',
  kept: '#eab308',
  incoming: '#8b5cf6',
};

export class ReservoirSamplingVisualization implements AlgorithmVisualization {
  name = 'Reservoir Sampling';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const k = Math.min(3, Math.max(1, Math.floor(data.length / 4) || 3)); // reservoir size
    const stream = data.slice(0, Math.min(data.length, 15));
    if (stream.length < 8) {
      for (let i = stream.length; i < 10; i++) stream.push(Math.floor(Math.random() * 100));
    }
    const n = stream.length;

    // Seed random from data for reproducibility
    let seed = data.reduce((a, b) => a + Math.abs(b), 1);
    function seededRandom() {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    }

    this.steps.push({
      data: [...stream],
      highlights: stream.map((v, i) => ({ index: i, color: COLORS.stream, label: `${v}` })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Reservoir Sampling: select ${k} items uniformly at random from stream of ${n} elements`,
    });

    // Fill reservoir with first k elements
    const reservoir = stream.slice(0, k);

    this.steps.push({
      data: [...stream],
      highlights: stream.map((v, i) => ({
        index: i,
        color: i < k ? COLORS.reservoir : '#94a3b8',
        label: i < k ? `R[${i}]=${v}` : `${v}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: k }, (_, i) => i),
      stepDescription: `Initialize reservoir with first ${k} elements: [${reservoir.join(', ')}]`,
    });

    // Process remaining elements
    for (let i = k; i < n; i++) {
      const j = Math.floor(seededRandom() * (i + 1)); // random index in [0, i]
      const probability = (k / (i + 1) * 100).toFixed(1);

      if (j < k) {
        const replaced = reservoir[j];
        reservoir[j] = stream[i];

        this.steps.push({
          data: [...stream],
          highlights: [
            ...stream.map((v, idx) => {
              if (idx === i) return { index: idx, color: COLORS.incoming, label: `NEW ${v}` };
              if (reservoir.includes(v) && idx < i) {
                const rIdx = reservoir.indexOf(v);
                return { index: idx, color: COLORS.reservoir, label: `R[${rIdx}]` };
              }
              return { index: idx, color: '#94a3b8', label: `${v}` };
            }),
          ],
          comparisons: [],
          swaps: [[i, j]],
          sorted: [],
          stepDescription: `Element ${i} (${stream[i]}): j=${j} < k=${k} (prob ${probability}%). Replace R[${j}]=${replaced} with ${stream[i]}. Reservoir: [${reservoir.join(', ')}]`,
        });
      } else {
        this.steps.push({
          data: [...stream],
          highlights: [
            ...stream.map((v, idx) => {
              if (idx === i) return { index: idx, color: COLORS.kept, label: `skip ${v}` };
              return { index: idx, color: '#94a3b8', label: `${v}` };
            }),
          ],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Element ${i} (${stream[i]}): j=${j} >= k=${k} (prob ${probability}%). Skip. Reservoir: [${reservoir.join(', ')}]`,
        });
      }
    }

    // Final result
    this.steps.push({
      data: [...reservoir],
      highlights: reservoir.map((v, i) => ({ index: i, color: COLORS.reservoir, label: `R[${i}]=${v}` })),
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: k }, (_, i) => i),
      stepDescription: `Final reservoir sample (${k} of ${n}): [${reservoir.join(', ')}]. Each element had ${(k / n * 100).toFixed(1)}% chance.`,
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
