import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  current: '#3b82f6',
  tangent: '#eab308',
  converged: '#22c55e',
  function: '#8b5cf6',
};

export class NewtonsMethodVisualization implements AlgorithmVisualization {
  name = "Newton's Method";
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Find root of f(x) = x^2 - target (i.e., compute sqrt(target))
    const target = Math.abs(data[0] || 25) % 100 + 4;

    // f(x) = x^2 - target, f'(x) = 2x
    const f = (x: number) => x * x - target;
    const fPrime = (x: number) => 2 * x;

    let x = Math.abs(data[1] || target); // initial guess
    if (x < 1) x = target;
    const maxIter = 15;
    const epsilon = 0.0001;

    // Show function evaluation points to give a sense of the curve
    const samplePoints = Array.from({ length: 10 }, (_, i) => {
      const sx = (i + 1) * Math.ceil(Math.sqrt(target)) / 5;
      return Math.round(f(sx) * 100) / 100;
    });

    this.steps.push({
      data: samplePoints,
      highlights: samplePoints.map((v, i) => ({ index: i, color: COLORS.function, label: `f(${((i + 1) * Math.ceil(Math.sqrt(target)) / 5).toFixed(1)})=${v}` })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Newton's Method: find root of f(x) = x^2 - ${target} (i.e., sqrt(${target})). Initial guess x0 = ${x.toFixed(4)}`,
    });

    const iterations: number[] = [x];

    for (let iter = 0; iter < maxIter; iter++) {
      const fx = f(x);
      const fpx = fPrime(x);

      if (Math.abs(fpx) < 1e-12) break;

      const xNew = x - fx / fpx;

      this.steps.push({
        data: iterations.map((v) => Math.round(v * 1000) / 1000),
        highlights: [
          { index: iterations.length - 1, color: COLORS.current, label: `x${iter}=${x.toFixed(4)}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Iteration ${iter}: x=${x.toFixed(6)}, f(x)=${fx.toFixed(6)}, f'(x)=${fpx.toFixed(4)}. x_new = ${x.toFixed(4)} - ${fx.toFixed(4)}/${fpx.toFixed(4)} = ${xNew.toFixed(6)}`,
      });

      // Show tangent line intersection
      this.steps.push({
        data: [...iterations.map((v) => Math.round(v * 1000) / 1000), Math.round(xNew * 1000) / 1000],
        highlights: [
          { index: iterations.length - 1, color: COLORS.tangent, label: `from x${iter}` },
          { index: iterations.length, color: COLORS.current, label: `x${iter + 1}=${xNew.toFixed(4)}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Tangent at x=${x.toFixed(4)} crosses x-axis at x=${xNew.toFixed(6)} (error: ${Math.abs(f(xNew)).toFixed(8)})`,
      });

      x = xNew;
      iterations.push(x);

      if (Math.abs(fx) < epsilon) {
        break;
      }
    }

    // Final result
    const actualRoot = Math.sqrt(target);
    this.steps.push({
      data: iterations.map((v) => Math.round(v * 10000) / 10000),
      highlights: [{ index: iterations.length - 1, color: COLORS.converged, label: `root=${x.toFixed(6)}` }],
      comparisons: [],
      swaps: [],
      sorted: [iterations.length - 1],
      stepDescription: `Converged: sqrt(${target}) = ${x.toFixed(8)} (actual: ${actualRoot.toFixed(8)}, error: ${Math.abs(x - actualRoot).toExponential(2)})`,
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
