export function priorityQueueOps(arr: number[]): number {
    if (arr.length === 0) return 0;

    const heap: number[] = [];

    function siftUp(i: number): void {
        while (i > 0) {
            const p = Math.floor((i - 1) / 2);
            if (heap[i] < heap[p]) { [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; }
            else break;
        }
    }

    function siftDown(i: number): void {
        while (true) {
            let s = i;
            const l = 2 * i + 1, r = 2 * i + 2;
            if (l < heap.length && heap[l] < heap[s]) s = l;
            if (r < heap.length && heap[r] < heap[s]) s = r;
            if (s !== i) { [heap[i], heap[s]] = [heap[s], heap[i]]; i = s; }
            else break;
        }
    }

    const opCount = arr[0];
    let idx = 1;
    let total = 0;

    for (let i = 0; i < opCount; i++) {
        const type = arr[idx], val = arr[idx + 1];
        idx += 2;
        if (type === 1) {
            heap.push(val);
            siftUp(heap.length - 1);
        } else if (type === 2) {
            if (heap.length === 0) continue;
            total += heap[0];
            heap[0] = heap[heap.length - 1];
            heap.pop();
            if (heap.length > 0) siftDown(0);
        }
    }
    return total;
}
