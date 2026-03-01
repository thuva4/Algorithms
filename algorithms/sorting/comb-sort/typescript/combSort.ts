/**
 * Comb Sort implementation.
 * Improves on Bubble Sort by using a gap larger than 1.
 * The gap starts with a large value and shrinks by a factor of 1.3 in every iteration until it reaches 1.
 * @param arr the input array
 * @returns a sorted copy of the array
 */
export function combSort(arr: number[]): number[] {
    const result = [...arr];
    const n = result.length;
    let gap = n;
    let sorted = false;
    const shrink = 1.3;

    while (!sorted) {
        gap = Math.floor(gap / shrink);
        if (gap <= 1) {
            gap = 1;
            sorted = true;
        }

        for (let i = 0; i < n - gap; i++) {
            if (result[i] > result[i + gap]) {
                [result[i], result[i + gap]] = [result[i + gap], result[i]];
                sorted = false;
            }
        }
    }

    return result;
}
