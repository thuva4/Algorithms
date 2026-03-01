export function exponentialSearch(arr: number[], target: number): number {
    const n = arr.length;
    if (n === 0) return -1;

    if (arr[0] === target) return 0;

    let bound = 1;
    while (bound < n && arr[bound] <= target) {
        bound *= 2;
    }

    let lo = Math.floor(bound / 2);
    let hi = Math.min(bound, n - 1);

    while (lo <= hi) {
        const mid = lo + Math.floor((hi - lo) / 2);
        if (arr[mid] === target) return mid;
        else if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }

    return -1;
}
