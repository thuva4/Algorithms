import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  current: '#3b82f6',
  converging: '#22c55e',
  variable: '#eab308',
  result: '#a855f7',
};

export class BorweinsAlgorithmVisualization implements AlgorithmVisualization {
  name = "Borwein's Algorithm";
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Number of iterations to perform (capped for visualization)
    const iterations = Math.min(Math.max(data[0] || 5, 2), 8);

    // Borwein's quartic algorithm for pi
    // Initialize: a0 = 6 - 4*sqrt(2), y0 = sqrt(2) - 1
    let a = 6 - 4 * Math.sqrt(2);
    let y = Math.sqrt(2) - 1;

    // Data array stores: [iteration, 1/a (pi approx), a, y, digits_correct]
    const makeData = (iter: number, piApprox: number, aVal: number, yVal: number): number[] => {
      const digitsCorrect = piApprox > 0 ? -Math.log10(Math.abs(piApprox - Math.PI)) : 0;
      return [iter, parseFloat(piApprox.toFixed(10)), parseFloat(aVal.toFixed(10)),
              parseFloat(yVal.toFixed(10)), parseFloat(Math.max(0, digitsCorrect).toFixed(1))];
    };

    this.steps.push({
      data: makeData(0, 1 / a, a, y),
      highlights: [
        { index: 0, color: COLORS.current, label: 'iter=0' },
        { index: 1, color: COLORS.result, label: `pi~${(1 / a).toFixed(6)}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Borwein quartic algorithm: a₀ = 6 - 4√2 ≈ ${a.toFixed(8)}, y₀ = √2 - 1 ≈ ${y.toFixed(8)}, 1/a₀ ≈ ${(1 / a).toFixed(8)}`,
    });

    for (let k = 1; k <= iterations; k++) {
      // Step 1: Compute y_(k+1) from y_k
      const y4 = Math.pow(y, 4);
      const fourthRoot = Math.pow(1 - y4, 0.25);

      this.steps.push({
        data: makeData(k, 1 / a, a, y),
        highlights: [
          { index: 3, color: COLORS.variable, label: `y^4=${y4.toFixed(6)}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Iteration ${k}: compute y⁴ = ${y4.toFixed(10)}`,
      });

      this.steps.push({
        data: makeData(k, 1 / a, a, y),
        highlights: [
          { index: 3, color: COLORS.variable, label: `(1-y⁴)^¼=${fourthRoot.toFixed(6)}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Iteration ${k}: compute (1 - y⁴)^(1/4) = ${fourthRoot.toFixed(10)}`,
      });

      const yNew = (1 - fourthRoot) / (1 + fourthRoot);

      this.steps.push({
        data: makeData(k, 1 / a, a, yNew),
        highlights: [
          { index: 3, color: COLORS.converging, label: `y_new=${yNew.toFixed(6)}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Iteration ${k}: y_{${k}} = (1 - root) / (1 + root) = ${yNew.toFixed(10)}`,
      });

      // Step 2: Compute a_(k+1) from a_k and y_(k+1)
      const yNew1 = 1 + yNew;
      const aNew = a * Math.pow(yNew1, 4) - Math.pow(4, k) * yNew * (1 + yNew + yNew * yNew);

      this.steps.push({
        data: makeData(k, 1 / aNew, aNew, yNew),
        highlights: [
          { index: 2, color: COLORS.variable, label: `a=${aNew.toFixed(6)}` },
          { index: 1, color: COLORS.result, label: `pi~${(1 / aNew).toFixed(8)}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Iteration ${k}: a_{${k}} = ${aNew.toFixed(10)}, 1/a ≈ ${(1 / aNew).toFixed(10)}`,
      });

      const digitsCorrect = -Math.log10(Math.abs(1 / aNew - Math.PI));

      this.steps.push({
        data: makeData(k, 1 / aNew, aNew, yNew),
        highlights: [
          { index: 1, color: COLORS.converging, label: `pi~${(1 / aNew).toFixed(8)}` },
          { index: 4, color: COLORS.result, label: `~${Math.max(0, digitsCorrect).toFixed(0)} digits` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Iteration ${k} complete: pi ≈ ${(1 / aNew).toFixed(10)} (~${Math.max(0, digitsCorrect).toFixed(0)} correct digits). True pi = ${Math.PI.toFixed(10)}`,
      });

      a = aNew;
      y = yNew;
    }

    // Final result
    this.steps.push({
      data: makeData(iterations, 1 / a, a, y),
      highlights: [
        { index: 1, color: COLORS.result, label: `pi=${(1 / a).toFixed(10)}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [1],
      stepDescription: `Borwein's algorithm complete after ${iterations} iterations. pi ≈ ${(1 / a).toFixed(14)}`,
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
