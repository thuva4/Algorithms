export function primsFibonacciHeap(arr: number[]): number {
    const n = arr[0], m = arr[1];
    const adj: [number, number][][] = Array.from({ length: n }, () => []);
    for (let i = 0; i < m; i++) {
        const u = arr[2+3*i], v = arr[2+3*i+1], w = arr[2+3*i+2];
        adj[u].push([w, v]); adj[v].push([w, u]);
    }

    const INF = 1e9;
    const inMst = new Array(n).fill(false);
    const key = new Array(n).fill(INF);
    key[0] = 0;
    // Simple O(V^2) for TS
    let total = 0;

    for (let iter = 0; iter < n; iter++) {
        let u = -1;
        for (let v = 0; v < n; v++) {
            if (!inMst[v] && (u === -1 || key[v] < key[u])) u = v;
        }
        inMst[u] = true;
        total += key[u];
        for (const [w, v] of adj[u]) {
            if (!inMst[v] && w < key[v]) key[v] = w;
        }
    }

    return total;
}
