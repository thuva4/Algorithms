def n_queens(n: int) -> int:
    """Return the number of distinct solutions to the N-Queens problem."""
    if n <= 0:
        return 0

    count = 0
    cols = set()
    diags = set()
    anti_diags = set()

    def backtrack(row: int) -> None:
        nonlocal count
        if row == n:
            count += 1
            return
        for col in range(n):
            if col in cols or (row - col) in diags or (row + col) in anti_diags:
                continue
            cols.add(col)
            diags.add(row - col)
            anti_diags.add(row + col)
            backtrack(row + 1)
            cols.remove(col)
            diags.remove(row - col)
            anti_diags.remove(row + col)

    backtrack(0)
    return count
