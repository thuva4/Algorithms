export function rangeTree(data: number[]): number {
    const n = data[0];
    const points = data.slice(1, 1 + n).sort((a, b) => a - b);
    const lo = data[1 + n], hi = data[2 + n];

    const lowerBound = (arr: number[], val: number): number => {
        let l = 0, r = arr.length;
        while (l < r) { const m = (l + r) >> 1; arr[m] < val ? l = m + 1 : r = m; }
        return l;
    };
    const upperBound = (arr: number[], val: number): number => {
        let l = 0, r = arr.length;
        while (l < r) { const m = (l + r) >> 1; arr[m] <= val ? l = m + 1 : r = m; }
        return l;
    };

    return upperBound(points, hi) - lowerBound(points, lo);
}

console.log(rangeTree([5, 1, 3, 5, 7, 9, 2, 6]));
console.log(rangeTree([4, 2, 4, 6, 8, 1, 10]));
