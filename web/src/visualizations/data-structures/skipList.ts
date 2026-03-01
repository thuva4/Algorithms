import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  searching: '#eab308',
  inserting: '#22c55e',
  levelUp: '#3b82f6',
  dropping: '#ef4444',
  found: '#8b5cf6',
  header: '#f97316',
  node: '#6b7280',
};

export class SkipListVisualization implements AlgorithmVisualization {
  name = 'Skip List';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const maxLevel = 4;
    // Skip list levels: level[0] is the base (all elements), level[i] has promoted elements
    const levels: number[][] = [[], [], [], [], []]; // 5 levels (0 through maxLevel)

    const sorted = [...data].sort((a, b) => a - b);
    const unique = [...new Set(sorted)];
    const elements = unique.slice(0, Math.min(unique.length, 10));

    // Build visualization data: show levels as a flat array
    // Layout: [level4_nodes..., level3_nodes..., level2_nodes..., level1_nodes..., level0_nodes...]
    const buildData = (): number[] => {
      const result: number[] = [];
      for (let lvl = maxLevel; lvl >= 0; lvl--) {
        for (const val of levels[lvl]) {
          result.push(val);
        }
      }
      while (result.length < data.length) result.push(0);
      return result.slice(0, data.length);
    };

    const getLevelOffset = (lvl: number): number => {
      let offset = 0;
      for (let l = maxLevel; l > lvl; l--) {
        offset += levels[l].length;
      }
      return offset;
    };

    this.steps.push({
      data: new Array(data.length).fill(0),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Skip List: probabilistic data structure with ${maxLevel + 1} levels. Each level is a sorted linked list. Higher levels act as express lanes.`,
    });

    // Insert elements
    for (const val of elements) {
      // Determine random level for this element
      let nodeLevel = 0;
      while (nodeLevel < maxLevel && Math.random() < 0.5) {
        nodeLevel++;
      }

      this.steps.push({
        data: buildData(),
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `INSERT ${val}: random level = ${nodeLevel}. Element will appear in levels 0 through ${nodeLevel}. (Coin flips: ${nodeLevel} heads then tails)`,
      });

      // Insert into each level 0..nodeLevel in sorted order
      for (let lvl = 0; lvl <= nodeLevel; lvl++) {
        // Find insertion position (binary search or linear)
        let pos = 0;
        while (pos < levels[lvl].length && levels[lvl][pos] < val) {
          pos++;
        }
        levels[lvl].splice(pos, 0, val);
      }

      // Show the skip list state after insertion
      const highlights: { index: number; color: string; label?: string }[] = [];
      for (let lvl = 0; lvl <= nodeLevel; lvl++) {
        const offset = getLevelOffset(lvl);
        const posInLevel = levels[lvl].indexOf(val);
        if (posInLevel >= 0 && offset + posInLevel < data.length) {
          highlights.push({
            index: offset + posInLevel,
            color: COLORS.inserting,
            label: `L${lvl}:${val}`,
          });
        }
      }

      this.steps.push({
        data: buildData(),
        highlights,
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Inserted ${val} into levels 0-${nodeLevel}. Level sizes: ${levels.map((l, i) => `L${i}:${l.length}`).join(', ')}.`,
      });
    }

    // Show full skip list structure
    const structureHighlights: { index: number; color: string; label?: string }[] = [];
    for (let lvl = maxLevel; lvl >= 0; lvl--) {
      const offset = getLevelOffset(lvl);
      for (let i = 0; i < levels[lvl].length; i++) {
        if (offset + i < data.length) {
          structureHighlights.push({
            index: offset + i,
            color: lvl === 0 ? COLORS.node : COLORS.levelUp,
            label: `L${lvl}`,
          });
        }
      }
    }

    this.steps.push({
      data: buildData(),
      highlights: structureHighlights,
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Skip list built. ${levels.map((l, i) => `Level ${i}: [${l.join(', ')}]`).filter((_, i) => levels[i].length > 0).join('. ')}.`,
    });

    // SEARCH operation
    const searchTargets = [
      elements[Math.floor(elements.length / 2)],
      elements[0],
      elements[elements.length - 1] + 1, // non-existent
    ];

    for (const target of searchTargets) {
      this.steps.push({
        data: buildData(),
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `SEARCH ${target}: start at highest non-empty level, move right until overshoot, drop down.`,
      });

      // Search from top level down
      let searchLevel = maxLevel;
      while (searchLevel > 0 && levels[searchLevel].length === 0) searchLevel--;

      let found = false;
      let position = -1;

      for (let lvl = searchLevel; lvl >= 0; lvl--) {
        // Scan right in this level
        let i = 0;
        while (i < levels[lvl].length && levels[lvl][i] < target) {
          const offset = getLevelOffset(lvl);
          if (offset + i < data.length) {
            this.steps.push({
              data: buildData(),
              highlights: [
                { index: offset + i, color: COLORS.searching, label: `${levels[lvl][i]}<${target}` },
              ],
              comparisons: [],
              swaps: [],
              sorted: [],
              stepDescription: `Level ${lvl}: ${levels[lvl][i]} < ${target}, move right.`,
            });
          }
          i++;
        }

        if (i < levels[lvl].length && levels[lvl][i] === target) {
          const offset = getLevelOffset(lvl);
          found = true;
          position = offset + i;

          this.steps.push({
            data: buildData(),
            highlights: [
              { index: position < data.length ? position : 0, color: COLORS.found, label: `FOUND!` },
            ],
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `FOUND ${target} at level ${lvl}! Skip list search: O(log n) expected time.`,
          });
          break;
        } else if (lvl > 0) {
          this.steps.push({
            data: buildData(),
            highlights: [],
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `Level ${lvl}: overshot or end reached. Dropping down to level ${lvl - 1}.`,
          });
        }
      }

      if (!found) {
        this.steps.push({
          data: buildData(),
          highlights: [],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `${target} NOT FOUND. Searched all levels. Element does not exist in skip list.`,
        });
      }
    }

    this.steps.push({
      data: buildData(),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: levels[0].length }, (_, i) => getLevelOffset(0) + i).filter(i => i < data.length),
      stepDescription: `Skip list complete. Expected O(log n) search, insert, delete. Space: O(n) expected. Probabilistic alternative to balanced BSTs.`,
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
