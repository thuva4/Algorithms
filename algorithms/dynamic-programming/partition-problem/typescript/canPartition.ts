export function canPartition(arr: number[]): number {
    const total = arr.reduce((a, b) => a + b, 0);
    if (total % 2 !== 0) return 0;
    const target = total / 2;
    const dp = new Array(target + 1).fill(false);
    dp[0] = true;
    for (const num of arr) {
        for (let j = target; j >= num; j--) {
            dp[j] = dp[j] || dp[j - num];
        }
    }
    return dp[target] ? 1 : 0;
}
