export function eggDrop(arr: number[]): number {
    const eggs = arr[0], floors = arr[1];
    const dp: number[][] = Array.from({ length: eggs + 1 }, () => new Array(floors + 1).fill(0));
    for (let f = 1; f <= floors; f++) dp[1][f] = f;
    for (let e = 2; e <= eggs; e++) {
        for (let f = 1; f <= floors; f++) {
            dp[e][f] = Infinity;
            for (let x = 1; x <= f; x++) {
                const worst = 1 + Math.max(dp[e - 1][x - 1], dp[e][f - x]);
                dp[e][f] = Math.min(dp[e][f], worst);
            }
        }
    }
    return dp[eggs][floors];
}
