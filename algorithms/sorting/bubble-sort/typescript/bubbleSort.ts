/**
 * Bubble Sort implementation.
 * Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.
 * Includes the 'swapped' flag optimization to terminate early if the array is already sorted.
 * @param arr the input array
 * @returns a sorted copy of the array
 */
export function bubbleSort(arr: number[]): number[] {
    // Create a copy of the input array to avoid modifying it
    const result = [...arr];
    const n = result.length;

    for (let i = 0; i < n - 1; i++) {
        // Optimization: track if any swaps occurred in this pass
        let swapped = false;

        // Last i elements are already in place, so we don't need to check them
        for (let j = 0; j < n - i - 1; j++) {
            if (result[j] > result[j + 1]) {
                // Swap elements if they are in the wrong order
                [result[j], result[j + 1]] = [result[j + 1], result[j]];
                swapped = true;
            }
        }

        // If no two elements were swapped by inner loop, then break
        if (!swapped) {
            break;
        }
    }

    return result;
}
