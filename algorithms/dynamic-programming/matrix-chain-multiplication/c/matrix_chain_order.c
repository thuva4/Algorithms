#include <stdio.h>
#include <limits.h>

/**
 * Given a sequence of matrix dimensions, find the minimum number
 * of scalar multiplications needed to compute the chain product.
 *
 * dims: array where matrix i has dimensions dims[i-1] x dims[i]
 * num_dims: length of dims array
 * Returns: minimum number of scalar multiplications
 */
int matrix_chain_order(int dims[], int num_dims) {
    int n = num_dims - 1; /* number of matrices */

    if (n <= 0) return 0;

    int m[n][n];
    int i, j, k, chainLen;

    for (i = 0; i < n; i++)
        for (j = 0; j < n; j++)
            m[i][j] = 0;

    for (chainLen = 2; chainLen <= n; chainLen++) {
        for (i = 0; i < n - chainLen + 1; i++) {
            j = i + chainLen - 1;
            m[i][j] = INT_MAX;
            for (k = i; k < j; k++) {
                int cost = m[i][k] + m[k + 1][j]
                         + dims[i] * dims[k + 1] * dims[j + 1];
                if (cost < m[i][j]) {
                    m[i][j] = cost;
                }
            }
        }
    }

    return m[0][n - 1];
}

int main() {
    int d1[] = {10, 20, 30};
    printf("%d\n", matrix_chain_order(d1, 3));  /* 6000 */

    int d2[] = {40, 20, 30, 10, 30};
    printf("%d\n", matrix_chain_order(d2, 5));  /* 26000 */

    int d3[] = {10, 20, 30, 40, 30};
    printf("%d\n", matrix_chain_order(d3, 5));  /* 30000 */

    int d4[] = {1, 2, 3, 4};
    printf("%d\n", matrix_chain_order(d4, 4));  /* 18 */

    int d5[] = {5, 10, 3, 12, 5, 50, 6};
    printf("%d\n", matrix_chain_order(d5, 7));  /* 2010 */

    return 0;
}
