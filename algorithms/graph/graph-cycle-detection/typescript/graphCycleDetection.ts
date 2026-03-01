export function graphCycleDetection(arr: number[]): number {
    const n = arr[0], m = arr[1];
    const adj: number[][] = Array.from({ length: n }, () => []);
    for (let i = 0; i < m; i++) {
        adj[arr[2 + 2 * i]].push(arr[2 + 2 * i + 1]);
    }
    const color = new Array(n).fill(0);

    function dfs(v: number): boolean {
        color[v] = 1;
        for (const w of adj[v]) {
            if (color[w] === 1) return true;
            if (color[w] === 0 && dfs(w)) return true;
        }
        color[v] = 2;
        return false;
    }

    for (let v = 0; v < n; v++) {
        if (color[v] === 0 && dfs(v)) return 1;
    }
    return 0;
}
