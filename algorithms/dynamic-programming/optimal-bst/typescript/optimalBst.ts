export function optimalBst(arr: number[]): number {
    const n = arr[0];
    const freq = arr.slice(1, n + 1);

    const cost: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) cost[i][i] = freq[i];

    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            cost[i][j] = Infinity;
            let freqSum = 0;
            for (let k = i; k <= j; k++) freqSum += freq[k];

            for (let r = i; r <= j; r++) {
                const left = r > i ? cost[i][r - 1] : 0;
                const right = r < j ? cost[r + 1][j] : 0;
                const c = left + right + freqSum;
                if (c < cost[i][j]) cost[i][j] = c;
            }
        }
    }

    return cost[0][n - 1];
}
