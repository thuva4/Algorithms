/**
 * Partial Sort implementation.
 * Returns the smallest k elements of the array in sorted order.
 * If k >= len(arr), returns the fully sorted array.
 * @param arr the input array
 * @param k the number of smallest elements to return
 * @returns a sorted copy of the array containing the k smallest elements
 */
export function partialSort(arr: number[], k: number): number[] {
    if (k <= 0) {
        return [];
    }
    const result = [...arr];
    result.sort((a, b) => a - b);
    return result.slice(0, k);
}
