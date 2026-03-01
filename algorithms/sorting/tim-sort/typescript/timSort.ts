const MIN_RUN = 32;

function insertionSortRange(arr: number[], left: number, right: number): void {
    for (let i = left + 1; i <= right; i++) {
        const key = arr[i];
        let j = i - 1;
        while (j >= left && arr[j] > key) { arr[j + 1] = arr[j]; j--; }
        arr[j + 1] = key;
    }
}

function mergeRuns(arr: number[], left: number, mid: number, right: number): void {
    const leftPart = arr.slice(left, mid + 1);
    const rightPart = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;
    while (i < leftPart.length && j < rightPart.length)
        arr[k++] = leftPart[i] <= rightPart[j] ? leftPart[i++] : rightPart[j++];
    while (i < leftPart.length) arr[k++] = leftPart[i++];
    while (j < rightPart.length) arr[k++] = rightPart[j++];
}

export function timSort(arr: number[]): number[] {
    const result = [...arr];
    const n = result.length;
    if (n <= 1) return result;

    for (let start = 0; start < n; start += MIN_RUN)
        insertionSortRange(result, start, Math.min(start + MIN_RUN - 1, n - 1));

    for (let size = MIN_RUN; size < n; size *= 2) {
        for (let left = 0; left < n; left += 2 * size) {
            const mid = Math.min(left + size - 1, n - 1);
            const right = Math.min(left + 2 * size - 1, n - 1);
            if (mid < right) mergeRuns(result, left, mid, right);
        }
    }
    return result;
}
