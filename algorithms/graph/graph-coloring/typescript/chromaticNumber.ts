export function chromaticNumber(arr: number[]): number {
    const n = arr[0];
    const m = arr[1];
    if (n === 0) return 0;
    if (m === 0) return 1;

    const adj: number[][] = Array.from({ length: n }, () => []);
    for (let i = 0; i < m; i++) {
        const u = arr[2 + 2 * i];
        const v = arr[2 + 2 * i + 1];
        adj[u].push(v);
        adj[v].push(u);
    }

    function isSafe(colors: number[], v: number, c: number): boolean {
        for (const u of adj[v]) {
            if (colors[u] === c) return false;
        }
        return true;
    }

    function solve(colors: number[], v: number, k: number): boolean {
        if (v === n) return true;
        for (let c = 1; c <= k; c++) {
            if (isSafe(colors, v, c)) {
                colors[v] = c;
                if (solve(colors, v + 1, k)) return true;
                colors[v] = 0;
            }
        }
        return false;
    }

    for (let k = 1; k <= n; k++) {
        const colors = new Array(n).fill(0);
        if (solve(colors, 0, k)) return k;
    }
    return n;
}
