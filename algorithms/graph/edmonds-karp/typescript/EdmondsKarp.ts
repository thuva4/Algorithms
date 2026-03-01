/**
 * Edmonds-Karp algorithm (BFS-based Ford-Fulkerson) for maximum flow.
 * @param capacity - Capacity matrix
 * @param source - Source node
 * @param sink - Sink node
 * @returns Maximum flow value
 */
export function edmondsKarp(capacity: number[][], source: number, sink: number): number {
    if (source === sink) return 0;

    const n = capacity.length;
    const residual = capacity.map(row => [...row]);
    let totalFlow = 0;

    while (true) {
        // BFS to find augmenting path
        const parent = new Array(n).fill(-1);
        const visited = new Array(n).fill(false);
        const queue: number[] = [source];
        visited[source] = true;

        while (queue.length > 0 && !visited[sink]) {
            const u = queue.shift()!;
            for (let v = 0; v < n; v++) {
                if (!visited[v] && residual[u][v] > 0) {
                    visited[v] = true;
                    parent[v] = u;
                    queue.push(v);
                }
            }
        }

        if (!visited[sink]) break;

        // Find minimum capacity along path
        let pathFlow = Infinity;
        for (let v = sink; v !== source; v = parent[v]) {
            pathFlow = Math.min(pathFlow, residual[parent[v]][v]);
        }

        // Update residual capacities
        for (let v = sink; v !== source; v = parent[v]) {
            residual[parent[v]][v] -= pathFlow;
            residual[v][parent[v]] += pathFlow;
        }

        totalFlow += pathFlow;
    }

    return totalFlow;
}

// Example usage
const capacity = [
    [0, 10, 10, 0, 0, 0],
    [0, 0, 2, 4, 8, 0],
    [0, 0, 0, 0, 9, 0],
    [0, 0, 0, 0, 0, 10],
    [0, 0, 0, 6, 0, 10],
    [0, 0, 0, 0, 0, 0]
];

const result = edmondsKarp(capacity, 0, 5);
console.log("Maximum flow:", result);
