export function rodCut(prices: number[], n: number): number {
    const dp: number[] = new Array(n + 1).fill(0);

    for (let i = 1; i <= n; i++) {
        for (let j = 0; j < i; j++) {
            dp[i] = Math.max(dp[i], prices[j] + dp[i - j - 1]);
        }
    }

    return dp[n];
}

console.log(rodCut([1, 5, 8, 9, 10, 17, 17, 20], 8)); // 22
