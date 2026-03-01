export function eulerPath(arr: number[]): number {
    const n = arr[0], m = arr[1];
    if (n === 0) return 1;
    const adj: number[][] = Array.from({ length: n }, () => []);
    const degree = new Array(n).fill(0);
    for (let i = 0; i < m; i++) {
        const u = arr[2+2*i], v = arr[3+2*i];
        adj[u].push(v); adj[v].push(u);
        degree[u]++; degree[v]++;
    }
    for (const d of degree) if (d % 2 !== 0) return 0;
    let start = -1;
    for (let i = 0; i < n; i++) if (degree[i] > 0) { start = i; break; }
    if (start === -1) return 1;
    const visited = new Array(n).fill(false);
    const stack = [start];
    visited[start] = true;
    while (stack.length > 0) {
        const v = stack.pop()!;
        for (const u of adj[v]) if (!visited[u]) { visited[u] = true; stack.push(u); }
    }
    for (let i = 0; i < n; i++) if (degree[i] > 0 && !visited[i]) return 0;
    return 1;
}
