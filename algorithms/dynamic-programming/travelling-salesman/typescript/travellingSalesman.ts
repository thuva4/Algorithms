export function travellingSalesman(arr: number[]): number {
    const n = arr[0];
    if (n <= 1) return 0;
    const dist: number[][] = Array.from({ length: n }, (_, i) =>
        Array.from({ length: n }, (_, j) => arr[1 + i * n + j]));
    const INF = Number.MAX_SAFE_INTEGER;
    const full = (1 << n) - 1;
    const dp: number[][] = Array.from({ length: 1 << n }, () => new Array(n).fill(INF));
    dp[1][0] = 0;
    for (let mask = 1; mask <= full; mask++)
        for (let i = 0; i < n; i++) {
            if (dp[mask][i] >= INF || !(mask & (1 << i))) continue;
            for (let j = 0; j < n; j++) {
                if (mask & (1 << j)) continue;
                const nm = mask | (1 << j);
                dp[nm][j] = Math.min(dp[nm][j], dp[mask][i] + dist[i][j]);
            }
        }
    let result = INF;
    for (let i = 0; i < n; i++) result = Math.min(result, dp[full][i] + dist[i][0]);
    return result;
}
