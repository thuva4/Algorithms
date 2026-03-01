import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { matA: '#3b82f6', matB: '#ef4444', product: '#eab308', result: '#22c55e' };

export class StrassensMatrixVisualization implements AlgorithmVisualization {
  name = "Strassen's Matrix Multiplication";
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    // 2x2 matrices (4 elements each) = 8 elements total
    const vals = data.slice(0, 8).map(v => Math.abs(v) % 10);
    while (vals.length < 8) vals.push(Math.floor(Math.random() * 10));
    const A = vals.slice(0, 4);
    const B = vals.slice(4, 8);

    this.steps.push({
      data: [...A, ...B],
      highlights: [
        ...A.map((_, i) => ({ index: i, color: COLORS.matA, label: `A${Math.floor(i / 2) + 1}${(i % 2) + 1}` })),
        ...B.map((_, i) => ({ index: i + 4, color: COLORS.matB, label: `B${Math.floor(i / 2) + 1}${(i % 2) + 1}` })),
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Strassen's: multiply 2x2 matrices A=[[${A[0]},${A[1]}],[${A[2]},${A[3]}]] x B=[[${B[0]},${B[1]}],[${B[2]},${B[3]}]]`,
    });

    // 7 Strassen products
    const p1 = A[0] * (B[1] - B[3]);
    const p2 = (A[0] + A[1]) * B[3];
    const p3 = (A[2] + A[3]) * B[0];
    const p4 = A[3] * (B[2] - B[0]);
    const p5 = (A[0] + A[3]) * (B[0] + B[3]);
    const p6 = (A[1] - A[3]) * (B[2] + B[3]);
    const p7 = (A[0] - A[2]) * (B[0] + B[1]);

    const products = [p1, p2, p3, p4, p5, p6, p7];
    const labels = [
      `P1=A11*(B12-B22)=${p1}`,
      `P2=(A11+A12)*B22=${p2}`,
      `P3=(A21+A22)*B11=${p3}`,
      `P4=A22*(B21-B11)=${p4}`,
      `P5=(A11+A22)*(B11+B22)=${p5}`,
      `P6=(A12-A22)*(B21+B22)=${p6}`,
      `P7=(A11-A21)*(B11+B12)=${p7}`,
    ];

    for (let i = 0; i < 7; i++) {
      this.steps.push({
        data: [...products, 0],
        highlights: [{ index: i, color: COLORS.product, label: `P${i + 1}=${products[i]}` }],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: labels[i],
      });
    }

    const c11 = p5 + p4 - p2 + p6;
    const c12 = p1 + p2;
    const c21 = p3 + p4;
    const c22 = p5 + p1 - p3 - p7;
    const result = [c11, c12, c21, c22];

    this.steps.push({
      data: [...result, 0, 0, 0, 0],
      highlights: result.map((v, i) => ({ index: i, color: COLORS.result, label: `C${Math.floor(i / 2) + 1}${(i % 2) + 1}=${v}` })),
      comparisons: [],
      swaps: [],
      sorted: [0, 1, 2, 3],
      stepDescription: `Result: C=[[${c11},${c12}],[${c21},${c22}]] using only 7 multiplications!`,
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
