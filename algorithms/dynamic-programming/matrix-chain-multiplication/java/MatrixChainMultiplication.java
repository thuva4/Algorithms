public class MatrixChainMultiplication {

    /**
     * Given a sequence of matrix dimensions, find the minimum number
     * of scalar multiplications needed to compute the chain product.
     *
     * @param dims array where matrix i has dimensions dims[i-1] x dims[i]
     * @return minimum number of scalar multiplications
     */
    public static int matrixChainOrder(int[] dims) {
        int n = dims.length - 1; // number of matrices

        if (n <= 0) return 0;

        int[][] m = new int[n][n];

        for (int chainLen = 2; chainLen <= n; chainLen++) {
            for (int i = 0; i < n - chainLen + 1; i++) {
                int j = i + chainLen - 1;
                m[i][j] = Integer.MAX_VALUE;
                for (int k = i; k < j; k++) {
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

    public static void main(String[] args) {
        System.out.println(matrixChainOrder(new int[]{10, 20, 30}));            // 6000
        System.out.println(matrixChainOrder(new int[]{40, 20, 30, 10, 30}));    // 26000
        System.out.println(matrixChainOrder(new int[]{10, 20, 30, 40, 30}));    // 30000
        System.out.println(matrixChainOrder(new int[]{1, 2, 3, 4}));            // 18
        System.out.println(matrixChainOrder(new int[]{5, 10, 3, 12, 5, 50, 6})); // 2010
    }
}
