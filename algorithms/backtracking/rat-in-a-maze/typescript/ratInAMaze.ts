export function ratInMaze(arr: number[]): number {
    const n = arr[0];
    const grid: number[][] = [];
    let idx = 1;
    for (let i = 0; i < n; i++) {
        grid.push([]);
        for (let j = 0; j < n; j++) grid[i].push(arr[idx++]);
    }

    if (grid[0][0] === 0 || grid[n-1][n-1] === 0) return 0;
    const visited: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));

    function solve(r: number, c: number): boolean {
        if (r === n - 1 && c === n - 1) return true;
        if (r < 0 || r >= n || c < 0 || c >= n || grid[r][c] === 0 || visited[r][c]) return false;
        visited[r][c] = true;
        if (solve(r + 1, c) || solve(r, c + 1)) return true;
        visited[r][c] = false;
        return false;
    }

    return solve(0, 0) ? 1 : 0;
}
