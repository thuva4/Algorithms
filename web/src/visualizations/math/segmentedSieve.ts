import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  prime: '#22c55e',
  composite: '#ef4444',
  segment: '#3b82f6',
  marking: '#eab308',
  basePrime: '#8b5cf6',
};

export class SegmentedSieveVisualization implements AlgorithmVisualization {
  name = 'Segmented Sieve';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const limit = Math.min(Math.max(Math.abs(data[0] || 50) % 80 + 20, 20), 80);
    const segmentSize = Math.max(5, Math.min(10, Math.floor(Math.sqrt(limit))));

    this.steps.push({
      data: Array.from({ length: Math.min(limit, 20) }, (_, i) => i + 2),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Segmented Sieve: find primes up to ${limit} using segments of size ${segmentSize}`,
    });

    // Step 1: Find base primes up to sqrt(limit)
    const sqrtLimit = Math.floor(Math.sqrt(limit));
    const baseSieve: boolean[] = new Array(sqrtLimit + 1).fill(true);
    baseSieve[0] = baseSieve[1] = false;
    const basePrimes: number[] = [];

    for (let i = 2; i <= sqrtLimit; i++) {
      if (baseSieve[i]) {
        basePrimes.push(i);
        for (let j = i * i; j <= sqrtLimit; j += i) {
          baseSieve[j] = false;
        }
      }
    }

    this.steps.push({
      data: [...basePrimes],
      highlights: basePrimes.map((p, i) => ({ index: i, color: COLORS.basePrime, label: `${p}` })),
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: basePrimes.length }, (_, i) => i),
      stepDescription: `Base primes (up to sqrt(${limit})=${sqrtLimit}): [${basePrimes.join(', ')}]`,
    });

    // Step 2: Process segments
    const allPrimes: number[] = [...basePrimes];

    for (let low = sqrtLimit + 1; low <= limit; low += segmentSize) {
      const high = Math.min(low + segmentSize - 1, limit);
      const segLen = high - low + 1;
      const isPrime: boolean[] = new Array(segLen).fill(true);
      const segNumbers = Array.from({ length: segLen }, (_, i) => low + i);

      this.steps.push({
        data: [...segNumbers],
        highlights: segNumbers.map((n, i) => ({ index: i, color: COLORS.segment, label: `${n}` })),
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Processing segment [${low}..${high}]`,
      });

      // Mark composites using base primes
      for (const p of basePrimes) {
        let start = Math.ceil(low / p) * p;
        if (start === p) start += p; // skip prime itself

        const marked: number[] = [];
        for (let j = start; j <= high; j += p) {
          isPrime[j - low] = false;
          marked.push(j);
        }

        if (marked.length > 0) {
          this.steps.push({
            data: [...segNumbers],
            highlights: segNumbers.map((n, i) => ({
              index: i,
              color: marked.includes(n) ? COLORS.marking : isPrime[i] ? COLORS.segment : COLORS.composite,
              label: marked.includes(n) ? `${n}%${p}=0` : `${n}`,
            })),
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `Mark multiples of ${p} in [${low}..${high}]: ${marked.join(', ')}`,
          });
        }
      }

      // Collect primes from this segment
      const segmentPrimes: number[] = [];
      for (let i = 0; i < segLen; i++) {
        if (isPrime[i]) segmentPrimes.push(low + i);
      }
      allPrimes.push(...segmentPrimes);

      this.steps.push({
        data: [...segNumbers],
        highlights: segNumbers.map((n, i) => ({
          index: i,
          color: isPrime[i] ? COLORS.prime : COLORS.composite,
          label: `${n}${isPrime[i] ? ' P' : ''}`,
        })),
        comparisons: [],
        swaps: [],
        sorted: segNumbers.map((_, i) => (isPrime[i] ? i : -1)).filter((i) => i >= 0),
        stepDescription: `Segment [${low}..${high}] primes: [${segmentPrimes.join(', ')}]`,
      });
    }

    // Final result
    const displayPrimes = allPrimes.slice(0, 20);
    this.steps.push({
      data: [...displayPrimes],
      highlights: displayPrimes.map((p, i) => ({ index: i, color: COLORS.prime, label: `${p}` })),
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: displayPrimes.length }, (_, i) => i),
      stepDescription: `Found ${allPrimes.length} primes up to ${limit}: [${allPrimes.join(', ')}]`,
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
