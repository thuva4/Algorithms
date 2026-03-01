export function dungeonGame(grid: number[][]): number {
    const m = grid.length;
    if (m === 0) return 0;
    const n = grid[0].length;

    const dp: number[][] = Array.from({ length: m }, () => Array(n).fill(0));

    for (let i = m - 1; i >= 0; i--) {
        for (let j = n - 1; j >= 0; j--) {
            if (i === m - 1 && j === n - 1) {
                dp[i][j] = Math.min(0, grid[i][j]);
            } else if (i === m - 1) {
                dp[i][j] = Math.min(0, grid[i][j] + dp[i][j + 1]);
            } else if (j === n - 1) {
                dp[i][j] = Math.min(0, grid[i][j] + dp[i + 1][j]);
            } else {
                dp[i][j] = Math.min(0, grid[i][j] + Math.max(dp[i][j + 1], dp[i + 1][j]));
            }
        }
    }

    return Math.abs(dp[0][0]) + 1;
}

const grid = [[-2, -3, 3], [-5, -10, 1], [10, 30, -5]];
console.log(dungeonGame(grid)); // 7
