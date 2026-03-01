function flip(arr: number[], k: number): void {
    let i = 0;
    while (i < k) {
        [arr[i], arr[k]] = [arr[k], arr[i]];
        i++;
        k--;
    }
}

function findMax(arr: number[], n: number): number {
    let mi = 0;
    for (let i = 0; i < n; i++) {
        if (arr[i] > arr[mi]) {
            mi = i;
        }
    }
    return mi;
}

/**
 * Pancake Sort implementation.
 * Sorts the array by repeatedly flipping subarrays.
 * @param arr the input array
 * @returns a sorted copy of the array
 */
export function pancakeSort(arr: number[]): number[] {
    const result = [...arr];
    const n = result.length;

    for (let currSize = n; currSize > 1; currSize--) {
        const mi = findMax(result, currSize);

        if (mi !== currSize - 1) {
            flip(result, mi);
            flip(result, currSize - 1);
        }
    }

    return result;
}
