export function spfa(arr: number[]): number {
    const n = arr[0];
    const m = arr[1];
    const src = arr[2];
    const adj: [number, number][][] = Array.from({ length: n }, () => []);
    for (let i = 0; i < m; i++) {
        const u = arr[3 + 3 * i];
        const v = arr[3 + 3 * i + 1];
        const w = arr[3 + 3 * i + 2];
        adj[u].push([v, w]);
    }

    const INF = 1e9;
    const dist = new Array(n).fill(INF);
    dist[src] = 0;
    const inQueue = new Array(n).fill(false);
    const queue: number[] = [src];
    inQueue[src] = true;

    while (queue.length > 0) {
        const u = queue.shift()!;
        inQueue[u] = false;
        for (const [v, w] of adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                if (!inQueue[v]) {
                    queue.push(v);
                    inQueue[v] = true;
                }
            }
        }
    }

    return dist[n - 1] === INF ? -1 : dist[n - 1];
}
