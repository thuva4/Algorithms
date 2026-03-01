import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  hashing: '#eab308',
  setting: '#ef4444',
  hit: '#22c55e',
  miss: '#3b82f6',
  falsePositive: '#f97316',
  default: '#6b7280',
};

export class BloomFilterVisualization implements AlgorithmVisualization {
  name = 'Bloom Filter';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  private hash1(val: number, size: number): number {
    return ((val * 7) + 3) % size;
  }

  private hash2(val: number, size: number): number {
    return ((val * 13) + 11) % size;
  }

  private hash3(val: number, size: number): number {
    return ((val * 19) + 5) % size;
  }

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const filterSize = Math.max(16, data.length * 3);
    const bitArray = new Array(filterSize).fill(0);
    const insertItems = data.slice(0, Math.ceil(data.length * 0.6));
    const queryItems = data.slice(Math.ceil(data.length * 0.4));
    const insertedSet = new Set<number>();

    // Initial state: empty bit array
    this.steps.push({
      data: [...bitArray],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Bloom filter initialized with ${filterSize} bits, all set to 0. Using 3 hash functions.`,
    });

    // Insert phase
    for (const item of insertItems) {
      const h1 = this.hash1(item, filterSize);
      const h2 = this.hash2(item, filterSize);
      const h3 = this.hash3(item, filterSize);
      insertedSet.add(item);

      // Show hash computation
      this.steps.push({
        data: [...bitArray],
        highlights: [
          { index: h1, color: COLORS.hashing, label: `h1(${item})` },
          { index: h2, color: COLORS.hashing, label: `h2(${item})` },
          { index: h3, color: COLORS.hashing, label: `h3(${item})` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `INSERT ${item}: h1=${h1}, h2=${h2}, h3=${h3}. Marking these bit positions.`,
      });

      // Set bits
      bitArray[h1] = 1;
      bitArray[h2] = 1;
      bitArray[h3] = 1;

      const setBits = [];
      for (let i = 0; i < filterSize; i++) {
        if (bitArray[i] === 1) setBits.push(i);
      }

      this.steps.push({
        data: [...bitArray],
        highlights: [
          { index: h1, color: COLORS.setting, label: '1' },
          { index: h2, color: COLORS.setting, label: '1' },
          { index: h3, color: COLORS.setting, label: '1' },
        ],
        comparisons: [],
        swaps: [],
        sorted: [...setBits],
        stepDescription: `Inserted ${item}. Bits at positions ${h1}, ${h2}, ${h3} set to 1. Total bits set: ${setBits.length}/${filterSize}.`,
      });
    }

    // Query/membership test phase
    for (const item of queryItems) {
      const h1 = this.hash1(item, filterSize);
      const h2 = this.hash2(item, filterSize);
      const h3 = this.hash3(item, filterSize);
      const isActuallyPresent = insertedSet.has(item);

      // Show hash positions being checked
      this.steps.push({
        data: [...bitArray],
        highlights: [
          { index: h1, color: COLORS.hashing, label: `h1(${item})` },
          { index: h2, color: COLORS.hashing, label: `h2(${item})` },
          { index: h3, color: COLORS.hashing, label: `h3(${item})` },
        ],
        comparisons: [[h1, h2], [h2, h3]],
        swaps: [],
        sorted: [],
        stepDescription: `QUERY ${item}: checking bits at h1=${h1}, h2=${h2}, h3=${h3}.`,
      });

      const allSet = bitArray[h1] === 1 && bitArray[h2] === 1 && bitArray[h3] === 1;
      const highlights: { index: number; color: string; label?: string }[] = [];

      if (allSet) {
        const color = isActuallyPresent ? COLORS.hit : COLORS.falsePositive;
        const resultLabel = isActuallyPresent ? 'TRUE POSITIVE' : 'FALSE POSITIVE';
        highlights.push(
          { index: h1, color, label: '1' },
          { index: h2, color, label: '1' },
          { index: h3, color, label: '1' },
        );
        this.steps.push({
          data: [...bitArray],
          highlights,
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `QUERY ${item}: all bits are 1 => "probably present". ${resultLabel}! ${
            isActuallyPresent ? 'Element was inserted.' : 'Element was NEVER inserted -- this is a false positive!'
          }`,
        });
      } else {
        const missPositions: number[] = [];
        for (const pos of [h1, h2, h3]) {
          if (bitArray[pos] === 0) missPositions.push(pos);
          highlights.push({
            index: pos,
            color: bitArray[pos] === 0 ? COLORS.miss : COLORS.default,
            label: `${bitArray[pos]}`,
          });
        }
        this.steps.push({
          data: [...bitArray],
          highlights,
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `QUERY ${item}: bit(s) at position(s) ${missPositions.join(', ')} are 0 => "definitely not present". Correct result.`,
        });
      }
    }

    // Final summary
    const totalSet = bitArray.filter(b => b === 1).length;
    const setBitsFinal: number[] = [];
    for (let i = 0; i < filterSize; i++) {
      if (bitArray[i] === 1) setBitsFinal.push(i);
    }
    this.steps.push({
      data: [...bitArray],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: setBitsFinal,
      stepDescription: `Bloom filter complete. ${totalSet}/${filterSize} bits set. Fill ratio: ${(totalSet / filterSize * 100).toFixed(1)}%.`,
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
