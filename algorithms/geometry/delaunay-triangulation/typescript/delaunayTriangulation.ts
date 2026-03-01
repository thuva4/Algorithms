export function delaunayTriangulation(arr: number[]): number {
    const n = arr[0];
    if (n < 3) return 0;

    const points: Array<[number, number]> = [];
    for (let i = 0; i < n; i++) {
        points.push([arr[1 + 2 * i], arr[1 + 2 * i + 1]]);
    }

    points.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

    function cross(a: [number, number], b: [number, number], c: [number, number]): number {
        return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    }

    const lower: Array<[number, number]> = [];
    for (const point of points) {
        while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) {
            lower.pop();
        }
        lower.push(point);
    }

    const upper: Array<[number, number]> = [];
    for (let i = points.length - 1; i >= 0; i--) {
        const point = points[i];
        while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) {
            upper.pop();
        }
        upper.push(point);
    }

    const hullSize = lower.length + upper.length - 2;
    return 2 * n - 2 - hullSize;
}
