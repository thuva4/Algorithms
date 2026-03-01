/**
 * Merge Sort implementation.
 * Sorts an array by recursively dividing it into halves, sorting each half,
 * and then merging the sorted halves.
 * @param arr the input array
 * @returns a sorted copy of the array
 */
export function mergeSort(arr: number[]): number[] {
    if (arr.length <= 1) {
        return [...arr];
    }

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
}
