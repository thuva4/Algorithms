export function allPairsShortestPath(arr: number[]): number {
    let idx = 0;
    const n = arr[idx++];
    const m = arr[idx++];

    const INF = 1000000000;
    const dist: number[][] = Array.from({ length: n }, (_, i) =>
        Array.from({ length: n }, (_, j) => i === j ? 0 : INF)
    );

    for (let e = 0; e < m; e++) {
        const u = arr[idx++], v = arr[idx++], w = arr[idx++];
        if (w < dist[u][v]) dist[u][v] = w;
    }

    for (let k = 0; k < n; k++)
        for (let i = 0; i < n; i++)
            for (let j = 0; j < n; j++)
                if (dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];

    return dist[0][n - 1] >= INF ? -1 : dist[0][n - 1];
}

console.log(allPairsShortestPath([3, 3, 0, 1, 1, 1, 2, 2, 0, 2, 10]));
console.log(allPairsShortestPath([2, 1, 0, 1, 5]));
console.log(allPairsShortestPath([4, 5, 0, 1, 3, 0, 2, 8, 1, 2, 2, 1, 3, 5, 2, 3, 1]));
console.log(allPairsShortestPath([3, 1, 1, 2, 4]));
