export function intervalScheduling(arr: number[]): number {
    const n = arr[0];
    const intervals: [number, number][] = [];
    for (let i = 0; i < n; i++) {
        intervals.push([arr[1 + 2 * i], arr[1 + 2 * i + 1]]);
    }

    intervals.sort((a, b) => a[1] - b[1]);

    let count = 0;
    let lastEnd = -1;
    for (const [start, end] of intervals) {
        if (start >= lastEnd) {
            count++;
            lastEnd = end;
        }
    }

    return count;
}
