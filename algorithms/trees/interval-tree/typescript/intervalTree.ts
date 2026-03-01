export function intervalTree(data: number[]): number {
    const n = data[0];
    const query = data[2 * n + 1];
    let count = 0;
    let idx = 1;
    for (let i = 0; i < n; i++) {
        const lo = data[idx], hi = data[idx + 1];
        idx += 2;
        if (lo <= query && query <= hi) count++;
    }
    return count;
}

console.log(intervalTree([3, 1, 5, 3, 8, 6, 10, 4]));
console.log(intervalTree([2, 1, 3, 5, 7, 10]));
console.log(intervalTree([3, 1, 10, 2, 9, 3, 8, 5]));
