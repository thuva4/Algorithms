export function convexHullJarvis(arr: number[]): number {
    const n = arr[0];
    if (n < 2) return n;

    const px: number[] = [], py: number[] = [];
    for (let i = 0; i < n; i++) {
        px.push(arr[1 + 2 * i]);
        py.push(arr[1 + 2 * i + 1]);
    }

    const cross = (o: number, a: number, b: number): number =>
        (px[a] - px[o]) * (py[b] - py[o]) - (py[a] - py[o]) * (px[b] - px[o]);

    const distSq = (a: number, b: number): number =>
        (px[a] - px[b]) * (px[a] - px[b]) + (py[a] - py[b]) * (py[a] - py[b]);

    let start = 0;
    for (let i = 1; i < n; i++) {
        if (px[i] < px[start] || (px[i] === px[start] && py[i] < py[start]))
            start = i;
    }

    const hull: number[] = [];
    let current = start;
    do {
        hull.push(current);
        let candidate = 0;
        for (let i = 1; i < n; i++) {
            if (i === current) continue;
            if (candidate === current) { candidate = i; continue; }
            const c = cross(current, candidate, i);
            if (c < 0) candidate = i;
            else if (c === 0 && distSq(current, i) > distSq(current, candidate))
                candidate = i;
        }
        current = candidate;
    } while (current !== start);

    return hull.length;
}
