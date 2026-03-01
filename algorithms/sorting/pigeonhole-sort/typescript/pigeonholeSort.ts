/**
 * Pigeonhole Sort implementation.
 * Efficient for sorting lists of integers where the number of elements is roughly the same as the number of possible key values.
 * @param arr the input array
 * @returns a sorted copy of the array
 */
export function pigeonholeSort(arr: number[]): number[] {
    if (arr.length === 0) {
        return [];
    }

    let min = arr[0];
    let max = arr[0];

    for (const val of arr) {
        if (val < min) min = val;
        if (val > max) max = val;
    }

    const range = max - min + 1;
    const holes: number[][] = Array.from({ length: range }, () => []);

    for (const val of arr) {
        holes[val - min].push(val);
    }

    const result: number[] = [];
    for (const hole of holes) {
        result.push(...hole);
    }

    return result;
}
