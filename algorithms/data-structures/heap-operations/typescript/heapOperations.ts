export function heapSortViaExtract(arr: number[]): number[] {
    const heap: number[] = [];

    function siftUp(i: number): void {
        while (i > 0) {
            const parent = Math.floor((i - 1) / 2);
            if (heap[i] < heap[parent]) {
                [heap[i], heap[parent]] = [heap[parent], heap[i]];
                i = parent;
            } else break;
        }
    }

    function siftDown(i: number, size: number): void {
        while (true) {
            let smallest = i;
            const left = 2 * i + 1, right = 2 * i + 2;
            if (left < size && heap[left] < heap[smallest]) smallest = left;
            if (right < size && heap[right] < heap[smallest]) smallest = right;
            if (smallest !== i) {
                [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
                i = smallest;
            } else break;
        }
    }

    for (const val of arr) {
        heap.push(val);
        siftUp(heap.length - 1);
    }

    const result: number[] = [];
    while (heap.length > 0) {
        result.push(heap[0]);
        heap[0] = heap[heap.length - 1];
        heap.pop();
        if (heap.length > 0) siftDown(0, heap.length);
    }

    return result;
}
