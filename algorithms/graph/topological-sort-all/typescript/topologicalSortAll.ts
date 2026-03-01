export function topologicalSortAll(arr: number[]): number {
    const n = arr[0];
    const m = arr[1];
    const adj: number[][] = Array.from({ length: n }, () => []);
    const inDeg = new Array(n).fill(0);
    for (let i = 0; i < m; i++) {
        const u = arr[2 + 2 * i], v = arr[2 + 2 * i + 1];
        adj[u].push(v);
        inDeg[v]++;
    }
    const visited = new Array(n).fill(false);
    let count = 0;

    function backtrack(placed: number): void {
        if (placed === n) { count++; return; }
        for (let v = 0; v < n; v++) {
            if (!visited[v] && inDeg[v] === 0) {
                visited[v] = true;
                for (const w of adj[v]) inDeg[w]--;
                backtrack(placed + 1);
                visited[v] = false;
                for (const w of adj[v]) inDeg[w]++;
            }
        }
    }

    backtrack(0);
    return count;
}
