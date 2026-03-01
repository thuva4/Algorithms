#include <iostream>
#include <vector>
#include <climits>
using namespace std;

/**
 * Given a sequence of matrix dimensions, find the minimum number
 * of scalar multiplications needed to compute the chain product.
 *
 * dims: vector where matrix i has dimensions dims[i-1] x dims[i]
 * Returns: minimum number of scalar multiplications
 */
int matrixChainOrder(const vector<int>& dims) {
    int n = dims.size() - 1; // number of matrices

    if (n <= 0) return 0;

    vector<vector<int>> m(n, vector<int>(n, 0));

    for (int chainLen = 2; chainLen <= n; chainLen++) {
        for (int i = 0; i < n - chainLen + 1; i++) {
            int j = i + chainLen - 1;
            m[i][j] = INT_MAX;
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

int main() {
    cout << matrixChainOrder({10, 20, 30}) << endl;              // 6000
    cout << matrixChainOrder({40, 20, 30, 10, 30}) << endl;      // 26000
    cout << matrixChainOrder({10, 20, 30, 40, 30}) << endl;      // 30000
    cout << matrixChainOrder({1, 2, 3, 4}) << endl;              // 18
    cout << matrixChainOrder({5, 10, 3, 12, 5, 50, 6}) << endl;  // 2010
    return 0;
}
