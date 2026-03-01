export function bitonicSort(arr: number[]): number[] {
    if (arr.length === 0) {
        return [];
    }

    const n = arr.length;
    let nextPow2 = 1;
    while (nextPow2 < n) {
        nextPow2 *= 2;
    }

    // Pad the array to the next power of 2
    const padded = new Array(nextPow2).fill(Infinity);
    for (let i = 0; i < n; i++) {
        padded[i] = arr[i];
    }

    function compareAndSwap(i: number, j: number, ascending: boolean) {
        if ((ascending && padded[i] > padded[j]) || (!ascending && padded[i] < padded[j])) {
            const temp = padded[i];
            padded[i] = padded[j];
            padded[j] = temp;
        }
    }

    function bitonicMerge(low: number, cnt: number, ascending: boolean) {
        if (cnt > 1) {
            const k = Math.floor(cnt / 2);
            for (let i = low; i < low + k; i++) {
                compareAndSwap(i, i + k, ascending);
            }
            bitonicMerge(low, k, ascending);
            bitonicMerge(low + k, k, ascending);
        }
    }

    function bitonicSortRecursive(low: number, cnt: number, ascending: boolean) {
        if (cnt > 1) {
            const k = Math.floor(cnt / 2);
            // Sort first half in ascending order
            bitonicSortRecursive(low, k, true);
            // Sort second half in descending order
            bitonicSortRecursive(low + k, k, false);
            // Merge the whole sequence in given order
            bitonicMerge(low, cnt, ascending);
        }
    }

    bitonicSortRecursive(0, nextPow2, true);

    // Return the first n elements
    return padded.slice(0, n);
}
