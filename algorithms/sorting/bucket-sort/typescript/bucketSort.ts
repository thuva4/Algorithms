/**
 * Bucket Sort implementation.
 * Divides the input into several buckets, each of which is then sorted individually.
 * @param arr the input array
 * @returns a sorted copy of the array
 */
export function bucketSort(arr: number[]): number[] {
    const n = arr.length;
    if (n <= 1) {
        return [...arr];
    }

    let min = arr[0];
    let max = arr[0];
    for (let i = 1; i < n; i++) {
        if (arr[i] < min) min = arr[i];
        if (arr[i] > max) max = arr[i];
    }

    if (min === max) {
        return [...arr];
    }

    // Initialize buckets
    const buckets: number[][] = Array.from({ length: n }, () => []);
    const range = max - min;

    // Distribute elements into buckets
    for (const x of arr) {
        const index = Math.floor(((x - min) * (n - 1)) / range);
        buckets[index].push(x);
    }

    // Sort each bucket and merge
    const result: number[] = [];
    for (const bucket of buckets) {
        if (bucket.length > 0) {
            // Using built-in sort for simplicity
            bucket.sort((a, b) => a - b);
            result.push(...bucket);
        }
    }

    return result;
}
