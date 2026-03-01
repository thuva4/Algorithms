from collections import deque


def flood_fill(grid: list[list[int]], start_row: int, start_col: int, new_value: int) -> list[list[int]]:
    if not grid or not grid[0]:
        return grid
    original = grid[start_row][start_col]
    if original == new_value:
        return grid
    rows = len(grid)
    cols = len(grid[0])
    queue = deque([(start_row, start_col)])
    grid[start_row][start_col] = new_value

    while queue:
        row, col = queue.popleft()
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr = row + dr
            nc = col + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == original:
                grid[nr][nc] = new_value
                queue.append((nr, nc))
    return grid
