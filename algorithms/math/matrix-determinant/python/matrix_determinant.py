def matrix_determinant(arr):
    """
    Compute determinant of an n x n matrix using Gaussian elimination.
    Input: [n, a11, a12, ..., ann]
    Returns: determinant value
    """
    idx = 0
    n = arr[idx]; idx += 1
    mat = []
    for i in range(n):
        row = []
        for j in range(n):
            row.append(float(arr[idx])); idx += 1
        mat.append(row)

    det = 1.0
    for col in range(n):
        # Find pivot
        max_row = col
        for row in range(col + 1, n):
            if abs(mat[row][col]) > abs(mat[max_row][col]):
                max_row = row
        if max_row != col:
            mat[col], mat[max_row] = mat[max_row], mat[col]
            det *= -1

        if mat[col][col] == 0:
            return 0

        det *= mat[col][col]

        for row in range(col + 1, n):
            factor = mat[row][col] / mat[col][col]
            for j in range(col + 1, n):
                mat[row][j] -= factor * mat[col][j]

    return int(round(det))


if __name__ == "__main__":
    print(matrix_determinant([2, 1, 2, 3, 4]))                # -2
    print(matrix_determinant([2, 1, 0, 0, 1]))                # 1
    print(matrix_determinant([3, 6, 1, 1, 4, -2, 5, 2, 8, 7]))  # -306
    print(matrix_determinant([1, 5]))                          # 5
