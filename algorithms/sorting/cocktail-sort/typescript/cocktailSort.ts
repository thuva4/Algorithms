/**
 * Cocktail Sort (Bidirectional Bubble Sort) implementation.
 * Repeatedly steps through the list in both directions, comparing adjacent elements 
 * and swapping them if they are in the wrong order.
 * @param arr the input array
 * @returns a sorted copy of the array
 */
export function cocktailSort(arr: number[]): number[] {
    const result = [...arr];
    const n = result.length;
    if (n <= 1) {
        return result;
    }

    let start = 0;
    let end = n - 1;
    let swapped = true;

    while (swapped) {
        swapped = false;

        // Forward pass
        for (let i = start; i < end; i++) {
            if (result[i] > result[i + 1]) {
                [result[i], result[i + 1]] = [result[i + 1], result[i]];
                swapped = true;
            }
        }

        if (!swapped) {
            break;
        }

        swapped = false;
        end--;

        // Backward pass
        for (let i = end - 1; i >= start; i--) {
            if (result[i] > result[i + 1]) {
                [result[i], result[i + 1]] = [result[i + 1], result[i]];
                swapped = true;
            }
        }

        start++;
    }

    return result;
}
