import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  setA: '#3b82f6',
  setB: '#eab308',
  sumPair: '#ef4444',
  result: '#22c55e',
  computing: '#8b5cf6',
};

export class SumsetVisualization implements AlgorithmVisualization {
  name = 'Sumset';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Split input into two sets A and B
    const halfLen = Math.max(3, Math.min(5, Math.floor(data.length / 2)));
    const setA = data.slice(0, halfLen).map((d) => Math.abs(d) % 20);
    let setB = data.slice(halfLen, halfLen * 2).map((d) => Math.abs(d) % 20);
    while (setB.length < 3) setB.push(Math.floor(Math.random() * 20));

    // Remove duplicates within each set
    const uniqueA = [...new Set(setA)].sort((a, b) => a - b);
    const uniqueB = [...new Set(setB)].sort((a, b) => a - b);

    const displayAll = [...uniqueA, ...uniqueB];

    this.steps.push({
      data: [...displayAll],
      highlights: [
        ...uniqueA.map((v, i) => ({ index: i, color: COLORS.setA, label: `A:${v}` })),
        ...uniqueB.map((v, i) => ({ index: uniqueA.length + i, color: COLORS.setB, label: `B:${v}` })),
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Sumset: compute A + B = {a + b | a in A, b in B}. A={${uniqueA.join(',')}}, B={${uniqueB.join(',')}}`,
    });

    // Compute all pairwise sums
    const sums = new Set<number>();
    const sumPairs: { a: number; b: number; sum: number }[] = [];

    for (let i = 0; i < uniqueA.length; i++) {
      for (let j = 0; j < uniqueB.length; j++) {
        const a = uniqueA[i];
        const b = uniqueB[j];
        const s = a + b;
        sumPairs.push({ a, b, sum: s });
        sums.add(s);

        // Show this computation
        this.steps.push({
          data: [...displayAll],
          highlights: [
            ...uniqueA.map((v, idx) => ({
              index: idx,
              color: idx === i ? COLORS.sumPair : COLORS.setA,
              label: idx === i ? `${v} +` : `${v}`,
            })),
            ...uniqueB.map((v, idx) => ({
              index: uniqueA.length + idx,
              color: idx === j ? COLORS.sumPair : COLORS.setB,
              label: idx === j ? `${v} = ${s}` : `${v}`,
            })),
          ],
          comparisons: [[i, uniqueA.length + j]],
          swaps: [],
          sorted: [],
          stepDescription: `${a} + ${b} = ${s}. Sums so far: {${[...sums].sort((x, y) => x - y).join(', ')}}`,
        });
      }
    }

    // Final sumset
    const sortedSums = [...sums].sort((a, b) => a - b);

    this.steps.push({
      data: [...sortedSums],
      highlights: sortedSums.map((s, i) => ({ index: i, color: COLORS.result, label: `${s}` })),
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: sortedSums.length }, (_, i) => i),
      stepDescription: `Sumset A+B = {${sortedSums.join(', ')}}. |A|=${uniqueA.length}, |B|=${uniqueB.length}, |A+B|=${sortedSums.length}`,
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
