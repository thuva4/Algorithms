import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  initializing: '#3b82f6',
  prime: '#22c55e',
  updating: '#ef4444',
  processed: '#eab308',
  result: '#a855f7',
};

export class EulerTotientSieveVisualization implements AlgorithmVisualization {
  name = 'Euler Totient Sieve';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = Math.min(Math.max(Math.abs(data[0] || 20), 5), 30);

    // phi[i] stores Euler's totient for i
    const phi: number[] = new Array(n + 1).fill(0);

    // Initialize phi[i] = i
    for (let i = 0; i <= n; i++) {
      phi[i] = i;
    }

    this.steps.push({
      data: [...phi],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Euler totient sieve: computing phi(i) for i = 0..${n}. Initialize phi[i] = i`,
    });

    // Sieve: for each prime p, update all multiples
    const processed: boolean[] = new Array(n + 1).fill(false);

    for (let i = 2; i <= n; i++) {
      if (phi[i] === i) {
        // i is prime (phi[i] hasn't been modified yet)
        this.steps.push({
          data: [...phi],
          highlights: [
            { index: i, color: COLORS.prime, label: `${i} prime` },
          ],
          comparisons: [],
          swaps: [],
          sorted: Array.from({ length: n + 1 }, (_, k) => k).filter(k => processed[k]),
          stepDescription: `Found prime ${i}: phi[${i}] is still ${i}, so ${i} is prime`,
        });

        // Update phi for all multiples of i
        for (let j = i; j <= n; j += i) {
          // phi[j] -= phi[j] / i  equivalent to phi[j] *= (1 - 1/i)
          const oldVal = phi[j];
          phi[j] -= Math.floor(phi[j] / i);

          if (j <= n) {
            this.steps.push({
              data: [...phi],
              highlights: [
                { index: i, color: COLORS.prime, label: `p=${i}` },
                { index: j, color: COLORS.updating, label: `phi[${j}]: ${oldVal}->${phi[j]}` },
              ],
              comparisons: [[i, j]],
              swaps: [],
              sorted: Array.from({ length: n + 1 }, (_, k) => k).filter(k => processed[k]),
              stepDescription: `Multiply ${j} by (1 - 1/${i}): phi[${j}] = ${oldVal} - ${oldVal}/${i} = ${phi[j]}`,
            });
          }
        }

        processed[i] = true;

        // Show state after processing this prime
        this.steps.push({
          data: [...phi],
          highlights: [
            { index: i, color: COLORS.processed, label: `p=${i} done` },
          ],
          comparisons: [],
          swaps: [],
          sorted: Array.from({ length: n + 1 }, (_, k) => k).filter(k => processed[k]),
          stepDescription: `Finished processing prime ${i}. Current phi values: [${phi.slice(0, Math.min(n + 1, 15)).join(', ')}${n > 14 ? '...' : ''}]`,
        });
      } else {
        processed[i] = true;
      }
    }

    // Final result: show all phi values
    this.steps.push({
      data: [...phi],
      highlights: phi.slice(2).map((v, idx) => ({
        index: idx + 2,
        color: COLORS.result,
        label: `phi(${idx + 2})=${v}`,
      })).slice(0, 12),
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: n + 1 }, (_, i) => i),
      stepDescription: `Sieve complete! phi values: ${phi.slice(1, Math.min(n + 1, 20)).map((v, i) => `phi(${i + 1})=${v}`).join(', ')}`,
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
