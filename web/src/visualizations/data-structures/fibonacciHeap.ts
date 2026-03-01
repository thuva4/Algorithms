import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  inserting: '#22c55e',
  minimum: '#ef4444',
  extracting: '#eab308',
  linking: '#3b82f6',
  cascadingCut: '#f97316',
  marked: '#8b5cf6',
};

interface FibNode {
  key: number;
  degree: number;
  marked: boolean;
  children: FibNode[];
}

export class FibonacciHeapVisualization implements AlgorithmVisualization {
  name = 'Fibonacci Heap';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const rootList: FibNode[] = [];
    let minNode: FibNode | null = null;

    const flattenHeap = (): number[] => {
      const result: number[] = [];
      for (const root of rootList) {
        result.push(root.key);
        const queue = [...root.children];
        while (queue.length > 0) {
          const node = queue.shift()!;
          result.push(node.key);
          queue.push(...node.children);
        }
      }
      while (result.length < data.length) result.push(0);
      return result;
    };

    const getRootHighlights = (): { index: number; color: string; label?: string }[] => {
      const highlights: { index: number; color: string; label?: string }[] = [];
      let idx = 0;
      for (const root of rootList) {
        const color = root === minNode ? COLORS.minimum : (root.marked ? COLORS.marked : COLORS.inserting);
        highlights.push({ index: idx, color, label: `d${root.degree}` });
        idx++;
        const queue = [...root.children];
        while (queue.length > 0) {
          const node = queue.shift()!;
          highlights.push({
            index: idx,
            color: node.marked ? COLORS.marked : COLORS.linking,
            label: `c`,
          });
          idx++;
          queue.push(...node.children);
        }
      }
      return highlights;
    };

    this.steps.push({
      data: new Array(data.length).fill(0),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: 'Fibonacci Heap initialized. Empty root list.',
    });

    // Insert phase
    const insertCount = Math.min(data.length, 10);
    for (let i = 0; i < insertCount; i++) {
      const newNode: FibNode = { key: data[i], degree: 0, marked: false, children: [] };
      rootList.push(newNode);

      if (!minNode || newNode.key < minNode.key) {
        minNode = newNode;
      }

      this.steps.push({
        data: flattenHeap(),
        highlights: [
          ...getRootHighlights(),
          { index: rootList.length - 1, color: COLORS.inserting, label: `new` },
        ].slice(0, flattenHeap().length),
        comparisons: [],
        swaps: [],
        sorted: minNode ? [flattenHeap().indexOf(minNode.key)] : [],
        stepDescription: `INSERT ${data[i]}: added to root list. Min = ${minNode.key}. Root list size = ${rootList.length}. O(1) insert.`,
      });
    }

    // Extract-min with consolidation
    const extractCount = Math.min(3, Math.floor(rootList.length / 2));
    for (let ext = 0; ext < extractCount; ext++) {
      if (!minNode || rootList.length === 0) break;

      const extractedKey = minNode.key;
      const extractedChildren = [...minNode.children];

      // Remove min from root list
      const minIdx = rootList.indexOf(minNode);
      rootList.splice(minIdx, 1);

      // Add children to root list
      for (const child of extractedChildren) {
        child.marked = false;
        rootList.push(child);
      }

      this.steps.push({
        data: flattenHeap(),
        highlights: getRootHighlights().slice(0, flattenHeap().length),
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `EXTRACT-MIN: removed ${extractedKey}. Its ${extractedChildren.length} children added to root list. Now consolidating...`,
      });

      // Consolidation: link roots of same degree
      if (rootList.length > 0) {
        const maxDegree = Math.floor(Math.log2(insertCount)) + 2;
        const degreeTable: (FibNode | null)[] = new Array(maxDegree + 1).fill(null);
        const consolidated: FibNode[] = [];

        let consolidationSteps = 0;
        const toProcess = [...rootList];
        rootList.length = 0;

        for (const node of toProcess) {
          let current = node;
          let d = current.degree;

          while (d < degreeTable.length && degreeTable[d] !== null) {
            let other = degreeTable[d]!;
            if (current.key > other.key) {
              const temp = current;
              current = other;
              other = temp;
            }
            // Link other under current
            current.children.push(other);
            current.degree++;
            other.marked = false;
            degreeTable[d] = null;
            d++;
            consolidationSteps++;

            if (consolidationSteps <= 5) {
              rootList.length = 0;
              for (let i = 0; i < degreeTable.length; i++) {
                if (degreeTable[i]) rootList.push(degreeTable[i]!);
              }
              rootList.push(current);
              this.steps.push({
                data: flattenHeap(),
                highlights: getRootHighlights().slice(0, flattenHeap().length),
                comparisons: [],
                swaps: [],
                sorted: [],
                stepDescription: `Consolidation: linked trees of degree ${d - 1}. ${other.key} becomes child of ${current.key} (degree now ${d}).`,
              });
            }
          }
          if (d < degreeTable.length) {
            degreeTable[d] = current;
          } else {
            consolidated.push(current);
          }
        }

        rootList.length = 0;
        for (const node of degreeTable) {
          if (node) rootList.push(node);
        }
        rootList.push(...consolidated);

        // Find new min
        minNode = rootList[0] || null;
        for (const root of rootList) {
          if (root.key < minNode!.key) {
            minNode = root;
          }
        }

        const minSorted = minNode ? [flattenHeap().indexOf(minNode.key)] : [];

        this.steps.push({
          data: flattenHeap(),
          highlights: getRootHighlights().slice(0, flattenHeap().length),
          comparisons: [],
          swaps: [],
          sorted: minSorted.filter(i => i >= 0),
          stepDescription: `Consolidation complete after extracting ${extractedKey}. ${rootList.length} root trees remain. New min = ${minNode ? minNode.key : 'none'}.`,
        });
      } else {
        minNode = null;
      }
    }

    // Decrease-key with cascading cuts
    if (rootList.length > 0) {
      for (const root of rootList) {
        if (root.children.length > 0) {
          const child = root.children[0];
          const oldKey = child.key;
          const newKey = Math.max(0, oldKey - Math.floor(Math.random() * 10) - 5);

          if (newKey < root.key) {
            // Cut child from parent
            root.children.splice(0, 1);
            root.degree--;
            child.key = newKey;
            child.marked = false;
            rootList.push(child);

            this.steps.push({
              data: flattenHeap(),
              highlights: [
                { index: flattenHeap().indexOf(newKey), color: COLORS.cascadingCut, label: `cut` },
              ].filter(h => h.index >= 0),
              comparisons: [],
              swaps: [],
              sorted: [],
              stepDescription: `DECREASE-KEY: ${oldKey} -> ${newKey}. Violated heap order (parent ${root.key}). Cut node and add to root list. Cascading cut triggered.`,
            });

            // Mark parent or cascading cut
            if (!root.marked) {
              root.marked = true;
              this.steps.push({
                data: flattenHeap(),
                highlights: getRootHighlights().slice(0, flattenHeap().length),
                comparisons: [],
                swaps: [],
                sorted: [],
                stepDescription: `Parent ${root.key} was unmarked, now marked. If cut again, cascading cut will propagate upward.`,
              });
            }

            if (minNode && newKey < minNode.key) {
              minNode = child;
            }
          }
          break;
        }
      }
    }

    const finalData = flattenHeap();
    this.steps.push({
      data: finalData,
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: finalData.filter(v => v !== 0).length }, (_, i) => i),
      stepDescription: `Fibonacci Heap operations complete. Amortized O(1) insert, O(1) decrease-key, O(log n) extract-min.`,
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
