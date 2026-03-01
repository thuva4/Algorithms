export function countingTriangles(data: number[]): number {
    const n = data[0];
    const m = data[1];

    const adj: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
    let idx = 2;
    for (let e = 0; e < m; e++) {
        const u = data[idx], v = data[idx + 1];
        adj[u][v] = true;
        adj[v][u] = true;
        idx += 2;
    }

    let count = 0;
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (adj[i][j]) {
                for (let k = j + 1; k < n; k++) {
                    if (adj[j][k] && adj[i][k]) {
                        count++;
                    }
                }
            }
        }
    }

    return count;
}
