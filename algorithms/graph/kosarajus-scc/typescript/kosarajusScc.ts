export function kosarajusScc(arr: number[]): number {
    const n = arr[0];
    const m = arr[1];
    const adj: number[][] = Array.from({ length: n }, () => []);
    const radj: number[][] = Array.from({ length: n }, () => []);
    for (let i = 0; i < m; i++) {
        const u = arr[2 + 2 * i];
        const v = arr[2 + 2 * i + 1];
        adj[u].push(v);
        radj[v].push(u);
    }

    const visited = new Array(n).fill(false);
    const order: number[] = [];

    function dfs1(v: number): void {
        visited[v] = true;
        for (const w of adj[v]) {
            if (!visited[w]) dfs1(w);
        }
        order.push(v);
    }

    for (let v = 0; v < n; v++) {
        if (!visited[v]) dfs1(v);
    }

    visited.fill(false);
    let sccCount = 0;

    function dfs2(v: number): void {
        visited[v] = true;
        for (const w of radj[v]) {
            if (!visited[w]) dfs2(w);
        }
    }

    for (let i = order.length - 1; i >= 0; i--) {
        const v = order[i];
        if (!visited[v]) {
            dfs2(v);
            sccCount++;
        }
    }

    return sccCount;
}
