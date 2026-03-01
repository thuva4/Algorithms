/**
 * Given a sequence of matrix dimensions, find the minimum number
 * of scalar multiplications needed to compute the chain product.
 *
 * @param dims - array where matrix i has dimensions dims[i-1] x dims[i]
 * @returns minimum number of scalar multiplications
 */
export function matrixChainOrder(dims: number[]): number {
    const n = dims.length - 1; // number of matrices

    if (n <= 0) return 0;

    const m: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

    for (let chainLen = 2; chainLen <= n; chainLen++) {
        for (let i = 0; i < n - chainLen + 1; i++) {
            const j = i + chainLen - 1;
            m[i][j] = Infinity;
            for (let k = i; k < j; k++) {
                const cost = m[i][k] + m[k + 1][j]
                           + dims[i] * dims[k + 1] * dims[j + 1];
                if (cost < m[i][j]) {
                    m[i][j] = cost;
                }
            }
        }
    }

    return m[0][n - 1];
}

console.log(matrixChainOrder([10, 20, 30]));            // 6000
console.log(matrixChainOrder([40, 20, 30, 10, 30]));    // 26000
console.log(matrixChainOrder([10, 20, 30, 40, 30]));    // 30000
console.log(matrixChainOrder([1, 2, 3, 4]));            // 18
console.log(matrixChainOrder([5, 10, 3, 12, 5, 50, 6])); // 2010
