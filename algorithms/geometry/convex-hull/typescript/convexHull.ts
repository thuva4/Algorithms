export function convexHullCount(arr: number[]): number {
    const n = arr[0];
    if (n <= 2) return n;

    const points: [number, number][] = [];
    let idx = 1;
    for (let i = 0; i < n; i++) {
        points.push([arr[idx], arr[idx + 1]]);
        idx += 2;
    }
    points.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);

    function cross(o: [number, number], a: [number, number], b: [number, number]): number {
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    }

    const lower: [number, number][] = [];
    for (const p of points) {
        while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
        lower.push(p);
    }

    const upper: [number, number][] = [];
    for (let i = points.length - 1; i >= 0; i--) {
        while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], points[i]) <= 0) upper.pop();
        upper.push(points[i]);
    }

    return lower.length - 1 + upper.length - 1;
}
