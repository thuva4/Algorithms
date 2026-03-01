/**
 * Insertion Sort implementation.
 * Builds the final sorted array (or list) one item at a time.
 * @param arr the input array
 * @returns a sorted copy of the array
 */
export function insertionSort(arr: number[]): number[] {
    const result = [...arr];
    const n = result.length;

    for (let i = 1; i < n; i++) {
        const key = result[i];
        let j = i - 1;

        while (j >= 0 && result[j] > key) {
            result[j + 1] = result[j];
            j = j - 1;
        }
        result[j + 1] = key;
    }

    return result;
}
