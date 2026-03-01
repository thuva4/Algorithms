export function planarityTesting(arr: number[]): number {
    const n = arr[0], m = arr[1];
    const edges = new Set<string>();
    for (let i = 0; i < m; i++) {
        const u = arr[2+2*i], v = arr[2+2*i+1];
        if (u !== v) {
            const a = Math.min(u, v), b = Math.max(u, v);
            edges.add(`${a},${b}`);
        }
    }
    const e = edges.size;
    if (n < 3) return 1;
    return e <= 3 * n - 6 ? 1 : 0;
}
