export function knuthOptimization(n: number, freq: number[]): number {
    const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    const opt: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    const prefix: number[] = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + freq[i];

    for (let i = 0; i < n; i++) {
        dp[i][i] = freq[i];
        opt[i][i] = i;
    }

    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            dp[i][j] = Number.MAX_SAFE_INTEGER;
            const costSum = prefix[j + 1] - prefix[i];
            const lo = opt[i][j - 1];
            const hi = i + 1 <= j ? opt[i + 1][j] : j;
            for (let k = lo; k <= hi; k++) {
                const left = k > i ? dp[i][k - 1] : 0;
                const right = k < j ? dp[k + 1][j] : 0;
                const val = left + right + costSum;
                if (val < dp[i][j]) {
                    dp[i][j] = val;
                    opt[i][j] = k;
                }
            }
        }
    }
    return dp[0][n - 1];
}
