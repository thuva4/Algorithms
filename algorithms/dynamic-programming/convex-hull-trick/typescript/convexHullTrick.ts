export function convexHullTrick(
    _lineCount: number,
    lines: [number, number][],
    queries: number[]
): number[] {
    return queries.map((x) => {
        let best = Number.POSITIVE_INFINITY;
        for (const [m, b] of lines) {
            best = Math.min(best, m * x + b);
        }
        return best;
    });
}
