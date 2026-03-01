def rat_in_maze(arr: list[int]) -> int:
    n = arr[0]
    grid = [[0] * n for _ in range(n)]
    idx = 1
    for i in range(n):
        for j in range(n):
            grid[i][j] = arr[idx]
            idx += 1

    if grid[0][0] == 0 or grid[n - 1][n - 1] == 0:
        return 0

    visited = [[False] * n for _ in range(n)]

    def solve(r: int, c: int) -> bool:
        if r == n - 1 and c == n - 1:
            return True
        if r < 0 or r >= n or c < 0 or c >= n:
            return False
        if grid[r][c] == 0 or visited[r][c]:
            return False
        visited[r][c] = True
        if solve(r + 1, c) or solve(r, c + 1):
            return True
        visited[r][c] = False
        return False

    return 1 if solve(0, 0) else 0
