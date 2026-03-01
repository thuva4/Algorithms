/**
 * Longest path in a DAG using topological sort.
 * @param adjList - Weighted adjacency list where each entry is [neighbor, weight]
 * @param startNode - Starting node
 * @returns Object mapping node to longest distance from start
 */
export function longestPath(
    adjList: Record<string, number[][]>,
    startNode: number
): Record<string, number> {
    const numNodes = Object.keys(adjList).length;
    const visited = new Set<number>();
    const topoOrder: number[] = [];

    function dfs(node: number): void {
        visited.add(node);
        for (const edge of adjList[node.toString()] || []) {
            if (!visited.has(edge[0])) {
                dfs(edge[0]);
            }
        }
        topoOrder.push(node);
    }

    for (let i = 0; i < numNodes; i++) {
        if (!visited.has(i)) dfs(i);
    }

    const dist = new Array(numNodes).fill(-Infinity);
    dist[startNode] = 0;

    for (let i = topoOrder.length - 1; i >= 0; i--) {
        const u = topoOrder[i];
        if (dist[u] !== -Infinity) {
            for (const [v, w] of adjList[u.toString()] || []) {
                if (dist[u] + w > dist[v]) {
                    dist[v] = dist[u] + w;
                }
            }
        }
    }

    const result: Record<string, number> = {};
    for (let i = 0; i < numNodes; i++) {
        result[i.toString()] = dist[i];
    }
    return result;
}

// Example usage
const adjList = {
    "0": [[1, 3], [2, 6]],
    "1": [[3, 4], [2, 4]],
    "2": [[3, 2]],
    "3": []
};

const result = longestPath(adjList, 0);
console.log("Longest distances:", result);
