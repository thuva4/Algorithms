import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  butterfly: '#3b82f6',
  twiddle: '#eab308',
  upper: '#22c55e',
  lower: '#ef4444',
  stage: '#a855f7',
  result: '#22c55e',
};

export class InverseFastFourierTransformVisualization implements AlgorithmVisualization {
  name = 'Inverse Fast Fourier Transform';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // First compute FFT of input, then show IFFT to recover original
    let n = 1;
    const inputLen = Math.min(data.length, 8);
    while (n < inputLen) n *= 2;
    if (n < 4) n = 4;
    if (n > 8) n = 8;

    // Original signal
    const original: number[] = new Array(n).fill(0);
    for (let i = 0; i < n && i < data.length; i++) {
      original[i] = data[i] % 50;
    }

    this.steps.push({
      data: [...original],
      highlights: original.map((v, i) => ({
        index: i,
        color: COLORS.butterfly,
        label: `x[${i}]=${v}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `IFFT: reconstructing signal from frequency domain. Original signal: [${original.join(', ')}]`,
    });

    // Forward FFT first (to get frequency domain data)
    const fftRe: number[] = [...original];
    const fftIm: number[] = new Array(n).fill(0);
    this.fft(fftRe, fftIm, false);

    this.steps.push({
      data: fftRe.map(v => parseFloat(v.toFixed(2))),
      highlights: fftRe.map((v, i) => ({
        index: i,
        color: COLORS.stage,
        label: `X[${i}]=${v.toFixed(1)}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `FFT computed. Freq domain (real): [${fftRe.map(v => v.toFixed(2)).join(', ')}]. Now apply IFFT.`,
    });

    // IFFT: same as FFT but with conjugate twiddle factors, then divide by N
    const ifftRe: number[] = [...fftRe];
    const ifftIm: number[] = [...fftIm];

    // Bit-reversal permutation
    const logN = Math.log2(n);
    const bitReverse = (x: number, bits: number): number => {
      let result = 0;
      for (let i = 0; i < bits; i++) {
        result = (result << 1) | (x & 1);
        x >>= 1;
      }
      return result;
    };

    const reTemp: number[] = new Array(n);
    const imTemp: number[] = new Array(n);
    for (let i = 0; i < n; i++) {
      const j = bitReverse(i, logN);
      reTemp[i] = ifftRe[j];
      imTemp[i] = ifftIm[j];
    }
    for (let i = 0; i < n; i++) {
      ifftRe[i] = reTemp[i];
      ifftIm[i] = imTemp[i];
    }

    this.steps.push({
      data: ifftRe.map(v => parseFloat(v.toFixed(2))),
      highlights: ifftRe.map((v, i) => ({
        index: i,
        color: COLORS.stage,
        label: `${v.toFixed(1)}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `IFFT: after bit-reversal permutation: [${ifftRe.map(v => v.toFixed(2)).join(', ')}]`,
    });

    // Butterfly stages (same structure as FFT but positive twiddle angle)
    for (let s = 1; s <= logN; s++) {
      const m = 1 << s;
      const halfM = m >> 1;
      // IFFT uses +2pi/m instead of -2pi/m
      const wAngle = 2 * Math.PI / m;

      this.steps.push({
        data: ifftRe.map(v => parseFloat(v.toFixed(2))),
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `IFFT Stage ${s}/${logN}: butterfly size = ${m} (conjugate twiddle factors)`,
      });

      for (let k = 0; k < n; k += m) {
        for (let j = 0; j < halfM; j++) {
          const upperIdx = k + j;
          const lowerIdx = k + j + halfM;

          const angle = wAngle * j;
          const wRe = Math.cos(angle);
          const wIm = Math.sin(angle);

          const tRe = wRe * ifftRe[lowerIdx] - wIm * ifftIm[lowerIdx];
          const tIm = wRe * ifftIm[lowerIdx] + wIm * ifftRe[lowerIdx];

          const uRe = ifftRe[upperIdx];
          const uIm = ifftIm[upperIdx];

          ifftRe[upperIdx] = uRe + tRe;
          ifftIm[upperIdx] = uIm + tIm;
          ifftRe[lowerIdx] = uRe - tRe;
          ifftIm[lowerIdx] = uIm - tIm;

          this.steps.push({
            data: ifftRe.map(v => parseFloat(v.toFixed(2))),
            highlights: [
              { index: upperIdx, color: COLORS.upper, label: `${ifftRe[upperIdx].toFixed(1)}` },
              { index: lowerIdx, color: COLORS.lower, label: `${ifftRe[lowerIdx].toFixed(1)}` },
            ],
            comparisons: [[upperIdx, lowerIdx]],
            swaps: [],
            sorted: [],
            stepDescription: `IFFT Butterfly(${upperIdx},${lowerIdx}): W*_${m}^${j}. Upper=${ifftRe[upperIdx].toFixed(2)}, Lower=${ifftRe[lowerIdx].toFixed(2)}`,
          });
        }
      }
    }

    // Divide by N
    this.steps.push({
      data: ifftRe.map(v => parseFloat(v.toFixed(2))),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Divide all values by N=${n} to complete the inverse transform`,
    });

    for (let i = 0; i < n; i++) {
      ifftRe[i] /= n;
      ifftIm[i] /= n;
    }

    // Show recovered signal
    const recovered = ifftRe.map(v => parseFloat(v.toFixed(2)));

    this.steps.push({
      data: recovered,
      highlights: recovered.map((v, i) => ({
        index: i,
        color: COLORS.result,
        label: `x[${i}]=${v}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: n }, (_, i) => i),
      stepDescription: `IFFT complete! Recovered signal: [${recovered.join(', ')}]. Original: [${original.join(', ')}]. Match: ${recovered.every((v, i) => Math.abs(v - original[i]) < 0.01) ? 'YES' : 'approximate'}`,
    });

    return this.steps[0];
  }

  private fft(re: number[], im: number[], inverse: boolean): void {
    const n = re.length;
    const logN = Math.log2(n);

    const bitReverse = (x: number, bits: number): number => {
      let result = 0;
      for (let i = 0; i < bits; i++) {
        result = (result << 1) | (x & 1);
        x >>= 1;
      }
      return result;
    };

    const reTemp = [...re];
    const imTemp = [...im];
    for (let i = 0; i < n; i++) {
      const j = bitReverse(i, logN);
      re[i] = reTemp[j];
      im[i] = imTemp[j];
    }

    for (let s = 1; s <= logN; s++) {
      const m = 1 << s;
      const halfM = m >> 1;
      const sign = inverse ? 1 : -1;
      const wAngle = sign * 2 * Math.PI / m;

      for (let k = 0; k < n; k += m) {
        for (let j = 0; j < halfM; j++) {
          const angle = wAngle * j;
          const wRe = Math.cos(angle);
          const wIm = Math.sin(angle);
          const u = k + j;
          const l = k + j + halfM;

          const tRe = wRe * re[l] - wIm * im[l];
          const tIm = wRe * im[l] + wIm * re[l];

          const uRe = re[u];
          const uIm = im[u];

          re[u] = uRe + tRe;
          im[u] = uIm + tIm;
          re[l] = uRe - tRe;
          im[l] = uIm - tIm;
        }
      }
    }

    if (inverse) {
      for (let i = 0; i < n; i++) {
        re[i] /= n;
        im[i] /= n;
      }
    }
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
