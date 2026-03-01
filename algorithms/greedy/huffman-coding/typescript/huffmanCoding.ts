export function huffmanCoding(frequencies: number[]): number {
    if (frequencies.length <= 1) {
        return 0;
    }

    const heap = [...frequencies];
    heap.sort((a, b) => a - b);

    let totalCost = 0;
    while (heap.length > 1) {
        const left = heap.shift()!;
        const right = heap.shift()!;
        const merged = left + right;
        totalCost += merged;

        let i = 0;
        while (i < heap.length && heap[i] < merged) {
            i++;
        }
        heap.splice(i, 0, merged);
    }

    return totalCost;
}
