/**
 * Gnome Sort implementation.
 * A sorting algorithm which is similar to insertion sort in that it works with one item at a time
 * but gets the item to the proper place by a series of swaps, similar to a bubble sort.
 * @param arr the input array
 * @returns a sorted copy of the array
 */
export function gnomeSort(arr: number[]): number[] {
    const result = [...arr];
    let index = 1;

    while (index < result.length) {
        if (index === 0 || result[index] >= result[index - 1]) {
            index += 1;
        } else {
            [result[index], result[index - 1]] = [result[index - 1], result[index]];
            index -= 1;
        }
    }

    return result;
}
