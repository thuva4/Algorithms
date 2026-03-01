/**
 * Floyd-Warshall algorithm to find shortest paths between all pairs of vertices.
 * @param matrix - Distance matrix (2D array), use Infinity for no direct edge
 * @returns Shortest distance matrix
 */
export function floydWarshall(matrix: number[][]): number[][] {
    const n = matrix.length;
    const dist: number[][] = matrix.map(row => [...row]);

    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (
                    dist[i][k] !== Infinity &&
                    dist[k][j] !== Infinity &&
                    dist[i][k] + dist[k][j] < dist[i][j]
                ) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }

    return dist;
}

// Example usage
const matrix = [
    [0, 3, Infinity, 7],
    [8, 0, 2, Infinity],
    [5, Infinity, 0, 1],
    [2, Infinity, Infinity, 0]
];

const result = floydWarshall(matrix);
console.log("Shortest distance matrix:");
for (const row of result) {
    console.log(row.map(v => v === Infinity ? "INF" : v).join("\t"));
}
