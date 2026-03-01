import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  current: '#eab308',
  inserting: '#22c55e',
  deleting: '#ef4444',
  traversing: '#3b82f6',
  pointer: '#8b5cf6',
  head: '#f97316',
};

interface ListNode {
  value: number;
  next: ListNode | null;
}

export class LinkedListOperationsVisualization implements AlgorithmVisualization {
  name = 'Linked List Operations';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    let head: ListNode | null = null;
    let size = 0;

    const toArray = (): number[] => {
      const result: number[] = [];
      let curr = head;
      while (curr) {
        result.push(curr.value);
        curr = curr.next;
      }
      while (result.length < data.length) result.push(0);
      return result;
    };

    const nodeIndices = (): number[] => {
      const result: number[] = [];
      let curr = head;
      let i = 0;
      while (curr) {
        result.push(i);
        curr = curr.next;
        i++;
      }
      return result;
    };

    this.steps.push({
      data: new Array(data.length).fill(0),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: 'Linked list initialized. Head = null. Will demonstrate insert, traverse, and delete operations.',
    });

    // INSERT AT HEAD - first few elements
    const insertHeadCount = Math.min(3, data.length);
    for (let i = 0; i < insertHeadCount; i++) {
      const val = data[i];
      const newNode: ListNode = { value: val, next: head };
      head = newNode;
      size++;

      this.steps.push({
        data: toArray(),
        highlights: [
          { index: 0, color: COLORS.inserting, label: `new head` },
        ],
        comparisons: [],
        swaps: [],
        sorted: nodeIndices(),
        stepDescription: `INSERT AT HEAD: ${val}. New node's next pointer -> old head${size > 1 ? ` (${toArray()[1]})` : ' (null)'}. Head updated. List size: ${size}. O(1) operation.`,
      });
    }

    // INSERT AT TAIL - next few elements
    const insertTailCount = Math.min(3, data.length - insertHeadCount);
    for (let i = 0; i < insertTailCount; i++) {
      const val = data[insertHeadCount + i];

      // Traverse to find tail
      let curr = head;
      let idx = 0;
      const traverseHighlights: { index: number; color: string; label?: string }[] = [];

      while (curr && curr.next) {
        traverseHighlights.push({ index: idx, color: COLORS.traversing, label: `${curr.value}` });
        curr = curr.next;
        idx++;
      }

      if (traverseHighlights.length > 0) {
        this.steps.push({
          data: toArray(),
          highlights: traverseHighlights,
          comparisons: [],
          swaps: [],
          sorted: nodeIndices(),
          stepDescription: `INSERT AT TAIL: traversing to find the last node. Visiting ${traverseHighlights.length} node(s).`,
        });
      }

      const newNode: ListNode = { value: val, next: null };
      if (curr) {
        curr.next = newNode;
      } else {
        head = newNode;
      }
      size++;

      this.steps.push({
        data: toArray(),
        highlights: [
          { index: size - 1, color: COLORS.inserting, label: `new tail` },
          ...(idx >= 0 ? [{ index: idx, color: COLORS.pointer, label: `->` }] : []),
        ],
        comparisons: [],
        swaps: [],
        sorted: nodeIndices(),
        stepDescription: `INSERT AT TAIL: ${val} appended. Previous tail's next pointer -> new node. List size: ${size}. O(n) traversal required.`,
      });
    }

    // INSERT AT POSITION
    if (size >= 3 && insertHeadCount + insertTailCount < data.length) {
      const val = data[insertHeadCount + insertTailCount];
      const pos = Math.min(2, size);

      let curr = head;
      let prev: ListNode | null = null;
      for (let i = 0; i < pos && curr; i++) {
        this.steps.push({
          data: toArray(),
          highlights: [
            { index: i, color: COLORS.traversing, label: `pos ${i}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: nodeIndices(),
          stepDescription: `INSERT AT POSITION ${pos}: traversing to position ${i}. Current node: ${curr.value}.`,
        });
        prev = curr;
        curr = curr.next;
      }

      const newNode: ListNode = { value: val, next: curr };
      if (prev) {
        prev.next = newNode;
      } else {
        head = newNode;
      }
      size++;

      this.steps.push({
        data: toArray(),
        highlights: [
          { index: pos, color: COLORS.inserting, label: `inserted` },
          ...(pos > 0 ? [{ index: pos - 1, color: COLORS.pointer, label: `->` }] : []),
          ...(pos + 1 < size ? [{ index: pos + 1, color: COLORS.pointer, label: `->` }] : []),
        ],
        comparisons: [],
        swaps: [],
        sorted: nodeIndices(),
        stepDescription: `INSERT AT POSITION ${pos}: ${val} inserted. Previous node's next -> new node -> old next node. List size: ${size}.`,
      });
    }

    // TRAVERSE - show full traversal
    {
      let curr = head;
      let idx = 0;
      while (curr) {
        this.steps.push({
          data: toArray(),
          highlights: [
            { index: idx, color: COLORS.current, label: `visit:${curr.value}` },
            ...(idx > 0 ? [{ index: 0, color: COLORS.head, label: 'head' }] : []),
          ],
          comparisons: [],
          swaps: [],
          sorted: Array.from({ length: idx }, (_, i) => i),
          stepDescription: `TRAVERSE: visiting node ${idx} with value ${curr.value}. Following next pointer.${curr.next ? ` Next: ${curr.next.value}.` : ' Next: null (end).'}`,
        });
        curr = curr.next;
        idx++;
      }
    }

    // DELETE FROM HEAD
    if (head) {
      const deletedVal = head.value;
      head = head.next;
      size--;

      this.steps.push({
        data: toArray(),
        highlights: [
          { index: 0, color: COLORS.deleting, label: `del head` },
        ],
        comparisons: [],
        swaps: [],
        sorted: nodeIndices(),
        stepDescription: `DELETE HEAD: removed ${deletedVal}. Head pointer updated to next node${head ? ` (${head.value})` : ' (null)'}. List size: ${size}. O(1) operation.`,
      });
    }

    // DELETE BY VALUE
    if (head && head.next) {
      const targetIdx = Math.min(1, size - 1);
      let curr = head;
      let prev: ListNode | null = null;
      let idx = 0;

      while (curr && idx < targetIdx) {
        prev = curr;
        curr = curr.next!;
        idx++;
      }

      if (curr) {
        const deletedVal = curr.value;

        this.steps.push({
          data: toArray(),
          highlights: [
            { index: idx, color: COLORS.deleting, label: `delete` },
            ...(prev ? [{ index: idx - 1, color: COLORS.pointer, label: `prev` }] : []),
            ...(curr.next ? [{ index: idx + 1, color: COLORS.pointer, label: `next` }] : []),
          ],
          comparisons: [],
          swaps: [],
          sorted: nodeIndices(),
          stepDescription: `DELETE BY POSITION: removing node at index ${idx} (value ${deletedVal}). Rewiring: prev.next -> curr.next.`,
        });

        if (prev) {
          prev.next = curr.next;
        } else {
          head = curr.next;
        }
        size--;

        this.steps.push({
          data: toArray(),
          highlights: [],
          comparisons: [],
          swaps: [],
          sorted: nodeIndices(),
          stepDescription: `Deleted ${deletedVal}. Pointers rewired. List size: ${size}. List: [${toArray().slice(0, size).join(' -> ')}].`,
        });
      }
    }

    this.steps.push({
      data: toArray(),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: nodeIndices(),
      stepDescription: `Linked list operations complete. Final list: [${toArray().slice(0, size).join(' -> ')}]. Insert/delete at head: O(1), at position: O(n).`,
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
