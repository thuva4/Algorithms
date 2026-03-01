import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  residual: '#ef4444',
  direction: '#3b82f6',
  solution: '#22c55e',
  alpha: '#eab308',
  result: '#a855f7',
};

export class ConjugateGradientVisualization implements AlgorithmVisualization {
  name = 'Conjugate Gradient';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Solve Ax = b for a 2x2 symmetric positive definite matrix
    // A = [[a11, a12], [a12, a22]], choose values that make it SPD
    const a11 = Math.max(Math.abs(data[0] || 4), 2);
    const a12 = (data[1] || 1) % Math.floor(a11 / 2);
    const a22 = Math.max(Math.abs(data[2] || 3), Math.abs(a12) + 1);
    const b1 = data[3] || 1;
    const b2 = data[4] || 2;

    // Matrix A and vector b
    const A = [[a11, a12], [a12, a22]];
    const b = [b1, b2];

    const matVec = (M: number[][], v: number[]): number[] =>
      [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]];

    const dot = (u: number[], v: number[]): number => u[0] * v[0] + u[1] * v[1];
    const vecSub = (u: number[], v: number[]): number[] => [u[0] - v[0], u[1] - v[1]];
    const vecAdd = (u: number[], v: number[]): number[] => [u[0] + v[0], u[1] + v[1]];
    const vecScale = (s: number, v: number[]): number[] => [s * v[0], s * v[1]];
    const norm = (v: number[]): number => Math.sqrt(dot(v, v));

    // data: [x0, x1, r_norm, iteration, alpha, beta]
    const makeData = (x: number[], rNorm: number, iter: number, alpha: number, beta: number): number[] =>
      [parseFloat(x[0].toFixed(6)), parseFloat(x[1].toFixed(6)),
       parseFloat(rNorm.toFixed(6)), iter,
       parseFloat(alpha.toFixed(6)), parseFloat(beta.toFixed(6))];

    // Initial guess x0 = [0, 0]
    let x = [0, 0];
    // r0 = b - A*x0 = b
    let r = [...b];
    // p0 = r0
    let p = [...r];
    let rsOld = dot(r, r);

    this.steps.push({
      data: makeData(x, norm(r), 0, 0, 0),
      highlights: [
        { index: 0, color: COLORS.solution, label: `x=[${x[0]},${x[1]}]` },
        { index: 2, color: COLORS.residual, label: `|r|=${norm(r).toFixed(4)}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Conjugate Gradient: solving A*x=b where A=[[${a11},${a12}],[${a12},${a22}]], b=[${b1},${b2}]. Initial x=[0,0], |r|=${norm(r).toFixed(4)}`,
    });

    const maxIter = Math.min(10, data.length > 5 ? data[5] : 10);
    const tolerance = 1e-10;

    for (let iter = 0; iter < maxIter && rsOld > tolerance; iter++) {
      const Ap = matVec(A, p);

      // Step 1: Compute alpha = r^T r / p^T A p
      const pAp = dot(p, Ap);
      const alpha = rsOld / pAp;

      this.steps.push({
        data: makeData(x, norm(r), iter + 1, alpha, 0),
        highlights: [
          { index: 4, color: COLORS.alpha, label: `alpha=${alpha.toFixed(4)}` },
          { index: 2, color: COLORS.direction, label: `p=[${p[0].toFixed(3)},${p[1].toFixed(3)}]` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Iteration ${iter + 1}: alpha = r^T*r / p^T*A*p = ${rsOld.toFixed(6)} / ${pAp.toFixed(6)} = ${alpha.toFixed(6)}`,
      });

      // Step 2: Update x = x + alpha*p
      x = vecAdd(x, vecScale(alpha, p));

      this.steps.push({
        data: makeData(x, norm(r), iter + 1, alpha, 0),
        highlights: [
          { index: 0, color: COLORS.solution, label: `x0=${x[0].toFixed(4)}` },
          { index: 1, color: COLORS.solution, label: `x1=${x[1].toFixed(4)}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Update x = x + alpha*p = [${x[0].toFixed(6)}, ${x[1].toFixed(6)}]`,
      });

      // Step 3: Update r = r - alpha*Ap
      r = vecSub(r, vecScale(alpha, Ap));
      const rsNew = dot(r, r);

      this.steps.push({
        data: makeData(x, norm(r), iter + 1, alpha, 0),
        highlights: [
          { index: 2, color: COLORS.residual, label: `|r|=${norm(r).toFixed(6)}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Update residual: r = r - alpha*A*p, |r| = ${norm(r).toFixed(6)}`,
      });

      if (rsNew < tolerance) {
        this.steps.push({
          data: makeData(x, norm(r), iter + 1, alpha, 0),
          highlights: [
            { index: 0, color: COLORS.result, label: `x0=${x[0].toFixed(4)}` },
            { index: 1, color: COLORS.result, label: `x1=${x[1].toFixed(4)}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [0, 1],
          stepDescription: `Converged! Residual ${norm(r).toFixed(10)} < tolerance. Solution: x=[${x[0].toFixed(6)}, ${x[1].toFixed(6)}]`,
        });
        break;
      }

      // Step 4: Compute beta and update direction
      const beta = rsNew / rsOld;
      p = vecAdd(r, vecScale(beta, p));
      rsOld = rsNew;

      this.steps.push({
        data: makeData(x, norm(r), iter + 1, alpha, beta),
        highlights: [
          { index: 5, color: COLORS.direction, label: `beta=${beta.toFixed(4)}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Update direction: beta = ${beta.toFixed(6)}, p = r + beta*p = [${p[0].toFixed(4)}, ${p[1].toFixed(4)}]`,
      });
    }

    // Final result
    this.steps.push({
      data: makeData(x, norm(r), 0, 0, 0),
      highlights: [
        { index: 0, color: COLORS.result, label: `x0=${x[0].toFixed(4)}` },
        { index: 1, color: COLORS.result, label: `x1=${x[1].toFixed(4)}` },
        { index: 2, color: COLORS.residual, label: `|r|=${norm(r).toFixed(8)}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [0, 1],
      stepDescription: `Conjugate gradient complete. Solution: x = [${x[0].toFixed(6)}, ${x[1].toFixed(6)}], residual = ${norm(r).toFixed(10)}`,
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
