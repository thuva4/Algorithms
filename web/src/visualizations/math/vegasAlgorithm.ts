import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  attempt: '#3b82f6',
  success: '#22c55e',
  failure: '#ef4444',
  target: '#eab308',
  random: '#8b5cf6',
};

export class VegasAlgorithmVisualization implements AlgorithmVisualization {
  name = 'Las Vegas Algorithm';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Las Vegas algorithm: randomized search that always gives correct answer
    // Example: find a specific target in unsorted array using random probing
    const arr = data.slice(0, Math.min(data.length, 15)).map((d) => Math.abs(d) % 100);
    while (arr.length < 10) arr.push(Math.floor(Math.random() * 100));

    // Choose a target that exists in the array
    let seed = data.reduce((a, b) => a + Math.abs(b), 7);
    function seededRandom() {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    }

    const targetIdx = Math.floor(seededRandom() * arr.length);
    const target = arr[targetIdx];

    this.steps.push({
      data: [...arr],
      highlights: arr.map((v, i) => ({ index: i, color: '#94a3b8', label: `${v}` })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Las Vegas Algorithm: find ${target} in array by random probing. Always correct, runtime varies.`,
    });

    // Random probing (Las Vegas style - keep trying until found)
    const probed = new Set<number>();
    let round = 0;
    let found = false;

    while (!found && round < 50) {
      // Pick a random unprobed index (or random if all probed)
      let probeIdx: number;
      if (probed.size < arr.length) {
        do {
          probeIdx = Math.floor(seededRandom() * arr.length);
        } while (probed.has(probeIdx) && probed.size < arr.length);
      } else {
        probeIdx = Math.floor(seededRandom() * arr.length);
      }

      probed.add(probeIdx);
      round++;

      const isMatch = arr[probeIdx] === target;

      this.steps.push({
        data: [...arr],
        highlights: arr.map((v, i) => {
          if (i === probeIdx) return { index: i, color: isMatch ? COLORS.success : COLORS.failure, label: isMatch ? `FOUND! ${v}` : `${v} != ${target}` };
          if (probed.has(i)) return { index: i, color: '#6b7280', label: `${v} (tried)` };
          return { index: i, color: '#94a3b8', label: `${v}` };
        }),
        comparisons: [[probeIdx, probeIdx]],
        swaps: [],
        sorted: isMatch ? [probeIdx] : [],
        stepDescription: `Round ${round}: probe index ${probeIdx}, value ${arr[probeIdx]}. ${isMatch ? `MATCH! Found ${target}!` : `Not ${target}. ${probed.size}/${arr.length} positions checked.`}`,
      });

      if (isMatch) {
        found = true;
        break;
      }
    }

    // Summary
    const expectedProbes = arr.length; // expected probes for unique target = n (coupon collector variant)
    this.steps.push({
      data: [...arr],
      highlights: arr.map((v, i) => ({
        index: i,
        color: i === targetIdx ? COLORS.success : '#94a3b8',
        label: i === targetIdx ? `${v} TARGET` : `${v}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: [targetIdx],
      stepDescription: `Las Vegas complete: found ${target} at index ${targetIdx} in ${round} random probes. Always correct, expected O(n)=${arr.length} probes.`,
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
