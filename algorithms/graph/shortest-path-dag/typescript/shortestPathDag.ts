/**
 * Find shortest path from source to vertex n-1 in a DAG.
 *
 * Input format: [n, m, src, u1, v1, w1, ...]
 * @param arr - input array
 * @returns shortest distance from src to n-1, or -1 if unreachable
 */
export function shortestPathDag(arr: number[]): number {
    let idx = 0;
    const n = arr[idx++];
    const m = arr[idx++];
    const src = arr[idx++];

    const adj: [number, number][][] = Array.from({ length: n }, () => []);
    const inDegree = new Array(n).fill(0);
    for (let i = 0; i < m; i++) {
        const u = arr[idx++], v = arr[idx++], w = arr[idx++];
        adj[u].push([v, w]);
        inDegree[v]++;
    }

    const queue: number[] = [];
    for (let i = 0; i < n; i++)
        if (inDegree[i] === 0) queue.push(i);

    const topoOrder: number[] = [];
    let front = 0;
    while (front < queue.length) {
        const node = queue[front++];
        topoOrder.push(node);
        for (const [v] of adj[node]) {
            if (--inDegree[v] === 0) queue.push(v);
        }
    }

    const INF = Number.MAX_SAFE_INTEGER;
    const dist = new Array(n).fill(INF);
    dist[src] = 0;

    for (const u of topoOrder) {
        if (dist[u] === INF) continue;
        for (const [v, w] of adj[u]) {
            if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
        }
    }

    return dist[n - 1] === INF ? -1 : dist[n - 1];
}

console.log(shortestPathDag([4, 4, 0, 0, 1, 2, 0, 2, 4, 1, 2, 1, 1, 3, 7])); // 3
console.log(shortestPathDag([3, 3, 0, 0, 1, 5, 0, 2, 3, 1, 2, 1]));          // 3
console.log(shortestPathDag([2, 1, 0, 0, 1, 10]));                            // 10
console.log(shortestPathDag([3, 1, 0, 1, 2, 5]));                             // -1
