function heapify(arr: number[], n: number, i: number): void {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < n && arr[l] > arr[largest]) {
        largest = l;
    }

    if (r < n && arr[r] > arr[largest]) {
        largest = r;
    }

    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest);
    }
}

/**
 * Heap Sort implementation.
 * Sorts an array by first building a max heap, then repeatedly extracting the maximum element.
 * @param arr the input array
 * @returns a sorted copy of the array
 */
export function heapSort(arr: number[]): number[] {
    const result = [...arr];
    const n = result.length;

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(result, n, i);
    }

    // Extract elements
    for (let i = n - 1; i > 0; i--) {
        [result[0], result[i]] = [result[i], result[0]];
        heapify(result, i, 0);
    }

    return result;
}
