import Foundation

func gaussianElimination(_ arr: [Int]) -> Int {
    var idx = 0; let n = arr[idx]; idx += 1
    var mat = [[Double]]()
    for _ in 0..<n { var row = [Double](); for _ in 0...n { row.append(Double(arr[idx])); idx += 1 }; mat.append(row) }
    for col in 0..<n {
        var maxRow = col
        for row in col+1..<n { if abs(mat[row][col]) > abs(mat[maxRow][col]) { maxRow = row } }
        mat.swapAt(col, maxRow)
        for row in col+1..<n {
            if mat[col][col] == 0 { continue }
            let f = mat[row][col] / mat[col][col]
            for j in col...n { mat[row][j] -= f * mat[col][j] }
        }
    }
    var sol = Array(repeating: 0.0, count: n)
    for i in stride(from: n-1, through: 0, by: -1) {
        sol[i] = mat[i][n]
        for j in i+1..<n { sol[i] -= mat[i][j] * sol[j] }
        sol[i] /= mat[i][i]
    }
    return Int(sol.reduce(0, +).rounded())
}

print(gaussianElimination([2, 1, 1, 3, 2, 1, 4]))
print(gaussianElimination([2, 1, 0, 5, 0, 1, 3]))
print(gaussianElimination([1, 2, 6]))
print(gaussianElimination([3, 1, 1, 1, 6, 0, 2, 1, 5, 0, 0, 3, 9]))
