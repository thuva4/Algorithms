/**
 * Johnson's algorithm for all-pairs shortest paths.
 * Combines Bellman-Ford with Dijkstra's algorithm.
 */
export function johnson(
    numVertices: number,
    edges: number[][]
): Record<string, Record<string, number>> | string {
    // Add virtual node
    const allEdges = [...edges];
    for (let i = 0; i < numVertices; i++) {
        allEdges.push([numVertices, i, 0]);
    }

    // Bellman-Ford from virtual node
    const h = new Array(numVertices + 1).fill(Infinity);
    h[numVertices] = 0;

    for (let i = 0; i < numVertices; i++) {
        for (const [u, v, w] of allEdges) {
            if (h[u] !== Infinity && h[u] + w < h[v]) {
                h[v] = h[u] + w;
            }
        }
    }

    for (const [u, v, w] of allEdges) {
        if (h[u] !== Infinity && h[u] + w < h[v]) {
            return "negative_cycle";
        }
    }

    // Reweight edges
    const adjList: Record<number, [number, number][]> = {};
    for (let i = 0; i < numVertices; i++) adjList[i] = [];
    for (const [u, v, w] of edges) {
        const newWeight = w + h[u] - h[v];
        adjList[u].push([v, newWeight]);
    }

    // Run Dijkstra from each vertex
    const result: Record<string, Record<string, number>> = {};
    for (let u = 0; u < numVertices; u++) {
        const dist = dijkstraHelper(numVertices, adjList, u);
        const distances: Record<string, number> = {};
        for (let v = 0; v < numVertices; v++) {
            distances[v.toString()] = dist[v] === Infinity
                ? Infinity
                : dist[v] - h[u] + h[v];
        }
        result[u.toString()] = distances;
    }

    return result;
}

function dijkstraHelper(
    n: number,
    adjList: Record<number, [number, number][]>,
    src: number
): number[] {
    const dist = new Array(n).fill(Infinity);
    const visited = new Array(n).fill(false);
    dist[src] = 0;

    for (let count = 0; count < n; count++) {
        let u = -1;
        let minDist = Infinity;
        for (let i = 0; i < n; i++) {
            if (!visited[i] && dist[i] < minDist) {
                minDist = dist[i];
                u = i;
            }
        }
        if (u === -1) break;
        visited[u] = true;

        for (const [v, w] of adjList[u] || []) {
            if (!visited[v] && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    return dist;
}

// Example usage
const edges = [[0,1,1], [1,2,2], [2,3,3], [0,3,10]];
const result = johnson(4, edges);
console.log("Result:", result);
