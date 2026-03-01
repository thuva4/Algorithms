import sys


def matrix_chain_order(dims):
    """
    Given a sequence of matrix dimensions, find the minimum number
    of scalar multiplications needed to compute the chain product.

    dims: list of integers where matrix i has dimensions dims[i-1] x dims[i]
    Returns: minimum number of scalar multiplications
    """
    n = len(dims) - 1  # number of matrices

    if n <= 0:
        return 0

    # m[i][j] = minimum cost of multiplying matrices i..j (0-indexed)
    m = [[0] * n for _ in range(n)]

    # chain_len is the length of the chain being considered
    for chain_len in range(2, n + 1):
        for i in range(n - chain_len + 1):
            j = i + chain_len - 1
            m[i][j] = sys.maxsize
            for k in range(i, j):
                cost = m[i][k] + m[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1]
                if cost < m[i][j]:
                    m[i][j] = cost

    return m[0][n - 1]


if __name__ == "__main__":
    print(matrix_chain_order([10, 20, 30]))          # 6000
    print(matrix_chain_order([40, 20, 30, 10, 30]))   # 26000
    print(matrix_chain_order([10, 20, 30, 40, 30]))    # 30000
    print(matrix_chain_order([1, 2, 3, 4]))            # 18
    print(matrix_chain_order([5, 10, 3, 12, 5, 50, 6]))  # 2010
