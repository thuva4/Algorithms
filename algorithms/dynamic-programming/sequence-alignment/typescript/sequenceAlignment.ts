const GAP_COST = 4;
const MISMATCH_COST = 3;

export function sequenceAlignment(s1: string, s2: string): number {
    const m = s1.length;
    const n = s2.length;

    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i * GAP_COST;
    for (let j = 0; j <= n; j++) dp[0][j] = j * GAP_COST;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const matchCost = s1[i - 1] === s2[j - 1] ? 0 : MISMATCH_COST;
            dp[i][j] = Math.min(
                dp[i - 1][j - 1] + matchCost,
                dp[i - 1][j] + GAP_COST,
                dp[i][j - 1] + GAP_COST
            );
        }
    }

    return dp[m][n];
}

console.log(sequenceAlignment("GCCCTAGCG", "GCGCAATG")); // 18
