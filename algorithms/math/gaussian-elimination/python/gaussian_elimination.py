def gaussian_elimination(arr):
    """
    Solve system of linear equations. Input: [n, a11, ..., a1n, b1, ...].
    Returns: sum of solution values (integer solutions).
    """
    idx = 0
    n = arr[idx]; idx += 1
    # Build augmented matrix
    mat = []
    for i in range(n):
        row = []
        for j in range(n + 1):
            row.append(float(arr[idx])); idx += 1
        mat.append(row)

    # Forward elimination with partial pivoting
    for col in range(n):
        # Find pivot
        max_row = col
        for row in range(col + 1, n):
            if abs(mat[row][col]) > abs(mat[max_row][col]):
                max_row = row
        mat[col], mat[max_row] = mat[max_row], mat[col]

        for row in range(col + 1, n):
            if mat[col][col] == 0:
                continue
            factor = mat[row][col] / mat[col][col]
            for j in range(col, n + 1):
                mat[row][j] -= factor * mat[col][j]

    # Back substitution
    sol = [0.0] * n
    for i in range(n - 1, -1, -1):
        sol[i] = mat[i][n]
        for j in range(i + 1, n):
            sol[i] -= mat[i][j] * sol[j]
        sol[i] /= mat[i][i]

    return int(round(sum(sol)))


if __name__ == "__main__":
    print(gaussian_elimination([2, 1, 1, 3, 2, 1, 4]))  # 3
    print(gaussian_elimination([2, 1, 0, 5, 0, 1, 3]))   # 8
    print(gaussian_elimination([1, 2, 6]))                # 3
    print(gaussian_elimination([3, 1, 1, 1, 6, 0, 2, 1, 5, 0, 0, 3, 9]))  # 6
