import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  hashing: '#eab308',
  inserting: '#22c55e',
  displacing: '#ef4444',
  checking: '#3b82f6',
  placed: '#8b5cf6',
};

export class CuckooHashingVisualization implements AlgorithmVisualization {
  name = 'Cuckoo Hashing';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  private hashA(val: number, size: number): number {
    return ((val * 7 + 3) % size + size) % size;
  }

  private hashB(val: number, size: number): number {
    return ((val * 11 + 5) % size + size) % size;
  }

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const tableSize = Math.max(8, data.length * 2);
    // Table A occupies indices [0, tableSize-1], Table B occupies [tableSize, 2*tableSize-1]
    const tableA: (number | null)[] = new Array(tableSize).fill(null);
    const tableB: (number | null)[] = new Array(tableSize).fill(null);
    const maxDisplacements = 10;

    const buildCombined = (): number[] => {
      const arr = new Array(tableSize * 2).fill(0);
      for (let i = 0; i < tableSize; i++) {
        arr[i] = tableA[i] !== null ? tableA[i]! : 0;
        arr[tableSize + i] = tableB[i] !== null ? tableB[i]! : 0;
      }
      return arr;
    };

    const getOccupied = (): number[] => {
      const occ: number[] = [];
      for (let i = 0; i < tableSize; i++) {
        if (tableA[i] !== null) occ.push(i);
        if (tableB[i] !== null) occ.push(tableSize + i);
      }
      return occ;
    };

    this.steps.push({
      data: buildCombined(),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Cuckoo hash tables initialized. Table A: indices 0-${tableSize - 1}. Table B: indices ${tableSize}-${tableSize * 2 - 1}. Size ${tableSize} each.`,
    });

    for (const item of data) {
      const hA = this.hashA(item, tableSize);
      const hB = this.hashB(item, tableSize);

      this.steps.push({
        data: buildCombined(),
        highlights: [
          { index: hA, color: COLORS.hashing, label: `hA(${item})` },
          { index: tableSize + hB, color: COLORS.hashing, label: `hB(${item})` },
        ],
        comparisons: [],
        swaps: [],
        sorted: getOccupied(),
        stepDescription: `INSERT ${item}: hashA=${hA}, hashB=${hB}. Try placing in Table A first.`,
      });

      let current = item;
      let useTableA = true;
      let displaced = false;
      let displacements = 0;

      while (displacements < maxDisplacements) {
        if (useTableA) {
          const pos = this.hashA(current, tableSize);
          if (tableA[pos] === null) {
            tableA[pos] = current;
            this.steps.push({
              data: buildCombined(),
              highlights: [
                { index: pos, color: COLORS.inserting, label: `${current}` },
              ],
              comparisons: [],
              swaps: [],
              sorted: getOccupied(),
              stepDescription: `Placed ${current} in Table A at position ${pos}. Slot was empty.`,
            });
            displaced = false;
            break;
          } else {
            const evicted = tableA[pos]!;
            tableA[pos] = current;

            this.steps.push({
              data: buildCombined(),
              highlights: [
                { index: pos, color: COLORS.displacing, label: `${current}` },
              ],
              comparisons: [],
              swaps: [[pos, tableSize + this.hashB(evicted, tableSize)]],
              sorted: getOccupied(),
              stepDescription: `Table A[${pos}] occupied by ${evicted}. Displacing it with ${current}. Evicted ${evicted} must move to Table B.`,
            });

            current = evicted;
            useTableA = false;
            displaced = true;
            displacements++;
          }
        } else {
          const pos = this.hashB(current, tableSize);
          if (tableB[pos] === null) {
            tableB[pos] = current;
            this.steps.push({
              data: buildCombined(),
              highlights: [
                { index: tableSize + pos, color: COLORS.inserting, label: `${current}` },
              ],
              comparisons: [],
              swaps: [],
              sorted: getOccupied(),
              stepDescription: `Placed ${current} in Table B at position ${pos}. Slot was empty.`,
            });
            displaced = false;
            break;
          } else {
            const evicted = tableB[pos]!;
            tableB[pos] = current;

            this.steps.push({
              data: buildCombined(),
              highlights: [
                { index: tableSize + pos, color: COLORS.displacing, label: `${current}` },
              ],
              comparisons: [],
              swaps: [[tableSize + pos, this.hashA(evicted, tableSize)]],
              sorted: getOccupied(),
              stepDescription: `Table B[${pos}] occupied by ${evicted}. Displacing it with ${current}. Evicted ${evicted} must move to Table A.`,
            });

            current = evicted;
            useTableA = true;
            displaced = true;
            displacements++;
          }
        }
      }

      if (displaced && displacements >= maxDisplacements) {
        this.steps.push({
          data: buildCombined(),
          highlights: [],
          comparisons: [],
          swaps: [],
          sorted: getOccupied(),
          stepDescription: `Displacement chain exceeded ${maxDisplacements} steps for element ${current}. Rehashing would be needed in practice.`,
        });
      }
    }

    this.steps.push({
      data: buildCombined(),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: getOccupied(),
      stepDescription: `Cuckoo hashing complete. Table A and Table B populated. O(1) worst-case lookup guaranteed.`,
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
