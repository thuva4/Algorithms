import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  tortoise: '#3b82f6',
  hare: '#ef4444',
  factor: '#22c55e',
  computing: '#eab308',
  cycle: '#8b5cf6',
};

export class PollardsRhoVisualization implements AlgorithmVisualization {
  name = "Pollard's Rho";
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Choose a composite number to factorize
    const composites = [15, 21, 33, 35, 51, 55, 77, 85, 91, 119, 143, 187, 221, 247, 299, 323];
    let n = composites[Math.abs(data[0] || 0) % composites.length];

    const c = (Math.abs(data[1] || 1) % 5) + 1; // constant for f(x) = x^2 + c

    this.steps.push({
      data: [n, c],
      highlights: [
        { index: 0, color: COLORS.computing, label: `n=${n}` },
        { index: 1, color: '#94a3b8', label: `c=${c}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Pollard's Rho: factorize ${n} using f(x) = (x^2 + ${c}) mod ${n}. Floyd's cycle detection.`,
    });

    function gcd(a: number, b: number): number {
      a = Math.abs(a);
      b = Math.abs(b);
      while (b) {
        [a, b] = [b, a % b];
      }
      return a;
    }

    const f = (x: number) => (x * x + c) % n;

    let x = 2; // tortoise
    let y = 2; // hare
    let d = 1;
    let step = 0;
    const maxSteps = 50;

    const tortoiseHistory: number[] = [x];
    const hareHistory: number[] = [y];

    while (d === 1 && step < maxSteps) {
      x = f(x); // tortoise moves one step
      y = f(f(y)); // hare moves two steps
      d = gcd(Math.abs(x - y), n);
      step++;

      tortoiseHistory.push(x);
      hareHistory.push(y);

      const displayData = [...tortoiseHistory.slice(-8)];
      const highlights = displayData.map((v, i) => ({
        index: i,
        color: i === displayData.length - 1 ? COLORS.tortoise : '#94a3b8',
        label: i === displayData.length - 1 ? `T=${v}` : `${v}`,
      }));

      this.steps.push({
        data: displayData,
        highlights,
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Step ${step}: tortoise=${x}, hare=${y}, |${x}-${y}|=${Math.abs(x - y)}, gcd(${Math.abs(x - y)}, ${n})=${d}`,
      });

      if (d !== 1 && d !== n) {
        // Found factor
        this.steps.push({
          data: [d, Math.floor(n / d), n],
          highlights: [
            { index: 0, color: COLORS.factor, label: `factor=${d}` },
            { index: 1, color: COLORS.factor, label: `${n}/${d}=${Math.floor(n / d)}` },
            { index: 2, color: COLORS.computing, label: `n=${n}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [0, 1],
          stepDescription: `Found factor! ${n} = ${d} x ${Math.floor(n / d)} (detected cycle after ${step} steps)`,
        });
        break;
      }
    }

    if (d === 1 || d === n) {
      this.steps.push({
        data: [n],
        highlights: [{ index: 0, color: COLORS.cycle, label: `Failed` }],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Failed to find factor with c=${c}. Try different constant c.`,
      });
    }

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
