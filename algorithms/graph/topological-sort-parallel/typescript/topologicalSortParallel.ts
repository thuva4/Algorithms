export function topologicalSortParallel(data: number[]): number {
    const n = data[0];
    const m = data[1];

    const adj: number[][] = Array.from({ length: n }, () => []);
    const indegree = new Array(n).fill(0);

    let idx = 2;
    for (let e = 0; e < m; e++) {
        const u = data[idx], v = data[idx + 1];
        adj[u].push(v);
        indegree[v]++;
        idx += 2;
    }

    let queue: number[] = [];
    for (let i = 0; i < n; i++) {
        if (indegree[i] === 0) queue.push(i);
    }

    let rounds = 0;
    let processed = 0;

    while (queue.length > 0) {
        const nextQueue: number[] = [];
        for (const node of queue) {
            processed++;
            for (const neighbor of adj[node]) {
                indegree[neighbor]--;
                if (indegree[neighbor] === 0) {
                    nextQueue.push(neighbor);
                }
            }
        }
        queue = nextQueue;
        rounds++;
    }

    return processed === n ? rounds : -1;
}
