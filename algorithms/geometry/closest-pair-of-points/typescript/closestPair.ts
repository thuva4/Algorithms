export function closestPair(arr: number[]): number {
    const n = arr.length / 2;
    const points: [number, number][] = [];
    for (let i = 0; i < n; i++) {
        points.push([arr[2 * i], arr[2 * i + 1]]);
    }
    points.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);

    function distSq(a: [number, number], b: [number, number]): number {
        return (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]);
    }

    function solve(l: number, r: number): number {
        if (r - l < 3) {
            let min = Infinity;
            for (let i = l; i <= r; i++) {
                for (let j = i + 1; j <= r; j++) {
                    min = Math.min(min, distSq(points[i], points[j]));
                }
            }
            return min;
        }

        const mid = Math.floor((l + r) / 2);
        const midX = points[mid][0];

        const dl = solve(l, mid);
        const dr = solve(mid + 1, r);
        let d = Math.min(dl, dr);

        const strip: [number, number][] = [];
        for (let i = l; i <= r; i++) {
            if ((points[i][0] - midX) * (points[i][0] - midX) < d) {
                strip.push(points[i]);
            }
        }
        strip.sort((a, b) => a[1] - b[1]);

        for (let i = 0; i < strip.length; i++) {
            for (let j = i + 1; j < strip.length &&
                    (strip[j][1] - strip[i][1]) * (strip[j][1] - strip[i][1]) < d; j++) {
                d = Math.min(d, distSq(strip[i], strip[j]));
            }
        }

        return d;
    }

    return solve(0, n - 1);
}
