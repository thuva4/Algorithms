export function countInversions(arr: number[]): number {
    if (arr.length <= 1) return 0;

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    let inv = countInversions(left) + countInversions(right);

    let i = 0, j = 0, k = 0;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            arr[k++] = left[i++];
        } else {
            arr[k++] = right[j++];
            inv += left.length - i;
        }
    }
    while (i < left.length) arr[k++] = left[i++];
    while (j < right.length) arr[k++] = right[j++];

    return inv;
}

const arr = [2, 4, 1, 3, 5];
console.log(`Number of inversions: ${countInversions(arr)}`);
