def sudoku_solve(board: list[int]) -> list[int]:
    """Solve a Sudoku puzzle represented as a flattened 81-element list.

    Empty cells are represented by 0. Returns the solved board as a
    flattened 81-element list, or an empty list if no solution exists.
    """
    grid = list(board)

    def is_valid(pos: int, num: int) -> bool:
        row, col = divmod(pos, 9)

        # Check row
        for c in range(9):
            if grid[row * 9 + c] == num:
                return False

        # Check column
        for r in range(9):
            if grid[r * 9 + col] == num:
                return False

        # Check 3x3 box
        box_row, box_col = 3 * (row // 3), 3 * (col // 3)
        for r in range(box_row, box_row + 3):
            for c in range(box_col, box_col + 3):
                if grid[r * 9 + c] == num:
                    return False

        return True

    def solve() -> bool:
        for i in range(81):
            if grid[i] == 0:
                for num in range(1, 10):
                    if is_valid(i, num):
                        grid[i] = num
                        if solve():
                            return True
                        grid[i] = 0
                return False
        return True

    if solve():
        return grid
    return []
