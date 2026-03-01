import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  butterfly: '#3b82f6',
  twiddle: '#eab308',
  upper: '#22c55e',
  lower: '#ef4444',
  stage: '#a855f7',
};

export class FastFourierTransformVisualization implements AlgorithmVisualization {
  name = 'Fast Fourier Transform';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Pad or truncate data to a power of 2
    let n = 1;
    const inputLen = Math.min(data.length, 8);
    while (n < inputLen) n *= 2;
    if (n < 4) n = 4;
    if (n > 8) n = 8;

    // Real part of input signal
    const realPart: number[] = new Array(n).fill(0);
    const imagPart: number[] = new Array(n).fill(0);
    for (let i = 0; i < n && i < data.length; i++) {
      realPart[i] = data[i] % 100; // Keep values small
    }

    this.steps.push({
      data: [...realPart],
      highlights: realPart.map((v, i) => ({
        index: i,
        color: COLORS.butterfly,
        label: `x[${i}]=${v}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `FFT of ${n}-point signal: [${realPart.join(', ')}]. Using Cooley-Tukey radix-2 butterfly.`,
    });

    // Bit-reversal permutation
    const bitReverse = (x: number, bits: number): number => {
      let result = 0;
      for (let i = 0; i < bits; i++) {
        result = (result << 1) | (x & 1);
        x >>= 1;
      }
      return result;
    };

    const logN = Math.log2(n);
    const re: number[] = new Array(n);
    const im: number[] = new Array(n);

    // Perform bit-reversal permutation
    for (let i = 0; i < n; i++) {
      const j = bitReverse(i, logN);
      re[i] = realPart[j];
      im[i] = imagPart[j];
    }

    this.steps.push({
      data: [...re],
      highlights: re.map((v, i) => ({
        index: i,
        color: COLORS.stage,
        label: `x[${i}]=${v}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `After bit-reversal permutation: [${re.join(', ')}]`,
    });

    // FFT butterfly stages
    for (let s = 1; s <= logN; s++) {
      const m = 1 << s; // 2^s
      const halfM = m >> 1;

      this.steps.push({
        data: re.map(v => parseFloat(v.toFixed(2))),
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Stage ${s}/${logN}: butterfly size = ${m}, half = ${halfM}`,
      });

      // Twiddle factor angle
      const wAngle = -2 * Math.PI / m;

      for (let k = 0; k < n; k += m) {
        for (let j = 0; j < halfM; j++) {
          const upperIdx = k + j;
          const lowerIdx = k + j + halfM;

          // Twiddle factor: W_m^j = cos(j*2pi/m) + i*sin(j*2pi/m)
          const angle = wAngle * j;
          const wRe = Math.cos(angle);
          const wIm = Math.sin(angle);

          // Butterfly operation
          const tRe = wRe * re[lowerIdx] - wIm * im[lowerIdx];
          const tIm = wRe * im[lowerIdx] + wIm * re[lowerIdx];

          const uRe = re[upperIdx];
          const uIm = im[upperIdx];

          re[upperIdx] = uRe + tRe;
          im[upperIdx] = uIm + tIm;
          re[lowerIdx] = uRe - tRe;
          im[lowerIdx] = uIm - tIm;

          this.steps.push({
            data: re.map(v => parseFloat(v.toFixed(2))),
            highlights: [
              { index: upperIdx, color: COLORS.upper, label: `${re[upperIdx].toFixed(1)}` },
              { index: lowerIdx, color: COLORS.lower, label: `${re[lowerIdx].toFixed(1)}` },
            ],
            comparisons: [[upperIdx, lowerIdx]],
            swaps: [],
            sorted: [],
            stepDescription: `Butterfly(${upperIdx},${lowerIdx}): W_${m}^${j}=(${wRe.toFixed(2)},${wIm.toFixed(2)}i). Upper=${re[upperIdx].toFixed(2)}, Lower=${re[lowerIdx].toFixed(2)}`,
          });
        }
      }

      // Show state after this stage
      this.steps.push({
        data: re.map(v => parseFloat(v.toFixed(2))),
        highlights: re.map((v, i) => ({
          index: i,
          color: COLORS.stage,
          label: `${v.toFixed(1)}`,
        })),
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Stage ${s} complete. Real parts: [${re.map(v => v.toFixed(2)).join(', ')}]`,
      });
    }

    // Show final magnitudes
    const magnitudes = re.map((r, i) => parseFloat(Math.sqrt(r * r + im[i] * im[i]).toFixed(2)));

    this.steps.push({
      data: magnitudes,
      highlights: magnitudes.map((v, i) => ({
        index: i,
        color: COLORS.butterfly,
        label: `|X[${i}]|=${v}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: n }, (_, i) => i),
      stepDescription: `FFT complete! Magnitude spectrum: [${magnitudes.join(', ')}]`,
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
