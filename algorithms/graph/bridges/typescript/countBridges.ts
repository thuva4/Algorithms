export function countBridges(arr: number[]): number {
    const n = arr[0];
    const m = arr[1];
    const adj: number[][] = Array.from({ length: n }, () => []);
    for (let i = 0; i < m; i++) {
        const u = arr[2 + 2 * i];
        const v = arr[2 + 2 * i + 1];
        adj[u].push(v);
        adj[v].push(u);
    }

    const disc = new Array(n).fill(-1);
    const low = new Array(n).fill(0);
    const parent = new Array(n).fill(-1);
    let timer = 0;
    let bridgeCount = 0;

    function dfs(u: number): void {
        disc[u] = timer;
        low[u] = timer;
        timer++;

        for (const v of adj[u]) {
            if (disc[v] === -1) {
                parent[v] = u;
                dfs(v);
                low[u] = Math.min(low[u], low[v]);
                if (low[v] > disc[u]) bridgeCount++;
            } else if (v !== parent[u]) {
                low[u] = Math.min(low[u], disc[v]);
            }
        }
    }

    for (let i = 0; i < n; i++) {
        if (disc[i] === -1) dfs(i);
    }

    return bridgeCount;
}
