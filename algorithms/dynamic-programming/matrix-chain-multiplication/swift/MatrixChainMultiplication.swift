/// Given a sequence of matrix dimensions, find the minimum number
/// of scalar multiplications needed to compute the chain product.
///
/// - Parameter dims: array where matrix i has dimensions dims[i-1] x dims[i]
/// - Returns: minimum number of scalar multiplications
func matrixChainOrder(_ dims: [Int]) -> Int {
    let n = dims.count - 1 // number of matrices

    if n <= 0 { return 0 }

    var m = Array(repeating: Array(repeating: 0, count: n), count: n)

    for chainLen in 2...n {
        for i in 0...(n - chainLen) {
            let j = i + chainLen - 1
            m[i][j] = Int.max
            for k in i..<j {
                let cost = m[i][k] + m[k + 1][j]
                         + dims[i] * dims[k + 1] * dims[j + 1]
                if cost < m[i][j] {
                    m[i][j] = cost
                }
            }
        }
    }

    return m[0][n - 1]
}

print(matrixChainOrder([10, 20, 30]))              // 6000
print(matrixChainOrder([40, 20, 30, 10, 30]))      // 26000
print(matrixChainOrder([10, 20, 30, 40, 30]))      // 30000
print(matrixChainOrder([1, 2, 3, 4]))              // 18
print(matrixChainOrder([5, 10, 3, 12, 5, 50, 6]))  // 2010
