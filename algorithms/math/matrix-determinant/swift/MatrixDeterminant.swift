import Foundation

func matrixDeterminant(_ arr: [Int]) -> Int {
    var idx = 0
    let n = arr[idx]; idx += 1
    var mat = [[Double]]()
    for _ in 0..<n {
        var row = [Double]()
        for _ in 0..<n {
            row.append(Double(arr[idx])); idx += 1
        }
        mat.append(row)
    }

    var det = 1.0
    for col in 0..<n {
        var maxRow = col
        for row in (col + 1)..<n {
            if abs(mat[row][col]) > abs(mat[maxRow][col]) {
                maxRow = row
            }
        }
        if maxRow != col {
            mat.swapAt(col, maxRow)
            det *= -1.0
        }
        if mat[col][col] == 0.0 { return 0 }
        det *= mat[col][col]
        for row in (col + 1)..<n {
            let factor = mat[row][col] / mat[col][col]
            for j in (col + 1)..<n {
                mat[row][j] -= factor * mat[col][j]
            }
        }
    }
    return Int(det.rounded())
}

print(matrixDeterminant([2, 1, 2, 3, 4]))
print(matrixDeterminant([2, 1, 0, 0, 1]))
print(matrixDeterminant([3, 6, 1, 1, 4, -2, 5, 2, 8, 7]))
print(matrixDeterminant([1, 5]))
