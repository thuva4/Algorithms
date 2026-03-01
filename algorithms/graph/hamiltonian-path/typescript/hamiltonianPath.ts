export function hamiltonianPath(arr: number[]): number {
    const n = arr[0], m = arr[1];
    if (n <= 1) return 1;
    const adj: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
    for (let i = 0; i < m; i++) {
        const u = arr[2+2*i], v = arr[3+2*i];
        adj[u][v] = true; adj[v][u] = true;
    }
    const full = (1 << n) - 1;
    const dp: boolean[][] = Array.from({ length: 1 << n }, () => new Array(n).fill(false));
    for (let i = 0; i < n; i++) dp[1 << i][i] = true;
    for (let mask = 1; mask <= full; mask++) {
        for (let i = 0; i < n; i++) {
            if (!dp[mask][i]) continue;
            for (let j = 0; j < n; j++) {
                if (!(mask & (1 << j)) && adj[i][j])
                    dp[mask | (1 << j)][j] = true;
            }
        }
    }
    for (let i = 0; i < n; i++) if (dp[full][i]) return 1;
    return 0;
}
