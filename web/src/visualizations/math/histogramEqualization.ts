import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  original: '#3b82f6',
  frequency: '#eab308',
  cumulative: '#ef4444',
  mapped: '#22c55e',
  result: '#a855f7',
};

export class HistogramEqualizationVisualization implements AlgorithmVisualization {
  name = 'Histogram Equalization';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Simulate pixel intensity values (0-255 range, but we'll use 0-15 for visualization)
    const maxVal = 15;
    const n = Math.min(Math.max(data.length, 8), 16);
    const pixels: number[] = [];
    for (let i = 0; i < n; i++) {
      pixels.push(Math.abs(data[i] !== undefined ? data[i] : (i * 3 + 2)) % (maxVal + 1));
    }

    this.steps.push({
      data: [...pixels],
      highlights: pixels.map((v, i) => ({
        index: i,
        color: COLORS.original,
        label: `${v}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Histogram equalization: ${n} pixel values in range [0, ${maxVal}]. Input: [${pixels.join(', ')}]`,
    });

    // Step 1: Compute histogram (frequency of each intensity)
    const histogram: number[] = new Array(maxVal + 1).fill(0);
    for (const p of pixels) {
      histogram[p]++;
    }

    this.steps.push({
      data: [...histogram],
      highlights: histogram.map((v, i) => ({
        index: i,
        color: COLORS.frequency,
        label: `${i}:${v}`,
      })).filter(h => histogram[parseInt(h.label)] > 0),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Step 1: Compute histogram. Frequencies: ${histogram.map((v, i) => v > 0 ? `${i}(${v})` : '').filter(Boolean).join(', ')}`,
    });

    // Step 2: Compute cumulative distribution function (CDF)
    const cdf: number[] = new Array(maxVal + 1).fill(0);
    cdf[0] = histogram[0];
    for (let i = 1; i <= maxVal; i++) {
      cdf[i] = cdf[i - 1] + histogram[i];
    }

    this.steps.push({
      data: [...cdf],
      highlights: cdf.map((v, i) => ({
        index: i,
        color: COLORS.cumulative,
        label: `cdf[${i}]=${v}`,
      })).filter((_, i) => histogram[i] > 0),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Step 2: Compute CDF. cdf[i] = cumulative sum of histogram[0..i]`,
    });

    // Show CDF buildup
    const cdfBuild: number[] = new Array(maxVal + 1).fill(0);
    cdfBuild[0] = histogram[0];
    for (let i = 1; i <= maxVal; i++) {
      cdfBuild[i] = cdfBuild[i - 1] + histogram[i];
      if (histogram[i] > 0) {
        this.steps.push({
          data: [...cdfBuild],
          highlights: [
            { index: i, color: COLORS.cumulative, label: `cdf[${i}]=${cdfBuild[i]}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: Array.from({ length: i + 1 }, (_, k) => k),
          stepDescription: `CDF[${i}] = CDF[${i - 1}] + hist[${i}] = ${cdfBuild[i - 1]} + ${histogram[i]} = ${cdfBuild[i]}`,
        });
      }
    }

    // Step 3: Find CDF minimum (first non-zero CDF value)
    let cdfMin = 0;
    for (let i = 0; i <= maxVal; i++) {
      if (cdf[i] > 0) {
        cdfMin = cdf[i];
        break;
      }
    }

    this.steps.push({
      data: [...cdf],
      highlights: [
        { index: cdf.indexOf(cdfMin), color: COLORS.frequency, label: `cdf_min=${cdfMin}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Step 3: CDF minimum = ${cdfMin} (first non-zero cumulative value)`,
    });

    // Step 4: Compute equalization mapping
    // h(v) = round((cdf(v) - cdf_min) / (N - cdf_min) * (L - 1))
    const mapping: number[] = new Array(maxVal + 1).fill(0);
    const totalPixels = pixels.length;

    this.steps.push({
      data: [...mapping],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Step 4: Compute mapping h(v) = round((cdf(v) - ${cdfMin}) / (${totalPixels} - ${cdfMin}) * ${maxVal})`,
    });

    for (let i = 0; i <= maxVal; i++) {
      if (histogram[i] > 0) {
        mapping[i] = Math.round(((cdf[i] - cdfMin) / (totalPixels - cdfMin)) * maxVal);

        this.steps.push({
          data: [...mapping],
          highlights: [
            { index: i, color: COLORS.mapped, label: `${i}->${mapping[i]}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Map ${i} -> h(${i}) = round((${cdf[i]} - ${cdfMin}) / (${totalPixels} - ${cdfMin}) * ${maxVal}) = ${mapping[i]}`,
        });
      }
    }

    // Step 5: Apply mapping to get equalized pixels
    const equalized: number[] = pixels.map(p => mapping[p]);

    this.steps.push({
      data: [...equalized],
      highlights: equalized.map((v, i) => ({
        index: i,
        color: COLORS.mapped,
        label: `${pixels[i]}->${v}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Step 5: Apply mapping. Original: [${pixels.join(',')}] -> Equalized: [${equalized.join(',')}]`,
    });

    // Show new histogram
    const newHist: number[] = new Array(maxVal + 1).fill(0);
    for (const p of equalized) {
      newHist[p]++;
    }

    this.steps.push({
      data: [...newHist],
      highlights: newHist.map((v, i) => ({
        index: i,
        color: COLORS.result,
        label: v > 0 ? `${i}:${v}` : '',
      })).filter(h => h.label !== ''),
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: maxVal + 1 }, (_, i) => i),
      stepDescription: `Equalization complete! New histogram is more uniformly distributed. Frequencies: ${newHist.map((v, i) => v > 0 ? `${i}(${v})` : '').filter(Boolean).join(', ')}`,
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
