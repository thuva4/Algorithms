/**
 * Counting Sort implementation.
 * Efficient for sorting integers with a known small range.
 * @param arr the input array
 * @returns a sorted copy of the array
 */
export function countingSort(arr: number[]): number[] {
    if (arr.length === 0) {
        return [];
    }

    let min = arr[0];
    let max = arr[0];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < min) min = arr[i];
        if (arr[i] > max) max = arr[i];
    }

    const range = max - min + 1;
    const count = new Array(range).fill(0);
    const output = new Array(arr.length);

    for (let i = 0; i < arr.length; i++) {
        count[arr[i] - min]++;
    }

    for (let i = 1; i < count.length; i++) {
        count[i] += count[i - 1];
    }

    for (let i = arr.length - 1; i >= 0; i--) {
        output[count[arr[i] - min] - 1] = arr[i];
        count[arr[i] - min]--;
    }

    return output;
}
