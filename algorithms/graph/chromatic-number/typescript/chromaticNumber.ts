export function chromaticNumber(arr: number[]): number {
    const n = arr[0], m = arr[1];
    const adj: number[][] = Array.from({ length: n }, () => []);
    for (let i = 0; i < m; i++) {
        const u = arr[2+2*i], v = arr[2+2*i+1];
        adj[u].push(v); adj[v].push(u);
    }
    if (m === 0) return 1;
    const color = new Array(n).fill(0);

    function canColor(v: number, c: number): boolean {
        for (const u of adj[v]) if (color[u] === c) return false;
        return true;
    }

    function backtrack(v: number, k: number): boolean {
        if (v === n) return true;
        for (let c = 1; c <= k; c++) {
            if (canColor(v, c)) {
                color[v] = c;
                if (backtrack(v + 1, k)) return true;
                color[v] = 0;
            }
        }
        return false;
    }

    for (let k = 1; k <= n; k++) {
        color.fill(0);
        if (backtrack(0, k)) return k;
    }
    return n;
}
