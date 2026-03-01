/**
 * Flood fill algorithm using DFS.
 * Fills all connected cells with the same value as (sr, sc) with newValue.
 */
export function floodFill(grid: number[][], sr: number, sc: number, newValue: number): number[][] {
    const originalValue = grid[sr][sc];
    if (originalValue === newValue) return grid;

    const rows = grid.length;
    const cols = grid[0].length;

    function dfs(r: number, c: number): void {
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== originalValue) return;
        grid[r][c] = newValue;
        dfs(r - 1, c);
        dfs(r + 1, c);
        dfs(r, c - 1);
        dfs(r, c + 1);
    }

    dfs(sr, sc);
    return grid;
}

// Example usage
const grid = [
    [1, 1, 1],
    [1, 1, 0],
    [1, 0, 1]
];

floodFill(grid, 0, 0, 2);
console.log("After flood fill:");
for (const row of grid) {
    console.log(row.join(" "));
}
