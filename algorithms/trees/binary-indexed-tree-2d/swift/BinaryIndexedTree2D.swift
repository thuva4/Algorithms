import Foundation

class BIT2DDS {
    var tree: [[Int]]
    var rows: Int, cols: Int

    init(_ rows: Int, _ cols: Int) {
        self.rows = rows; self.cols = cols
        tree = Array(repeating: Array(repeating: 0, count: cols + 1), count: rows + 1)
    }

    func update(_ r: Int, _ c: Int, _ val_: Int) {
        var i = r + 1
        while i <= rows {
            var j = c + 1
            while j <= cols { tree[i][j] += val_; j += j & (-j) }
            i += i & (-i)
        }
    }

    func query(_ r: Int, _ c: Int) -> Int {
        var s = 0; var i = r + 1
        while i > 0 {
            var j = c + 1
            while j > 0 { s += tree[i][j]; j -= j & (-j) }
            i -= i & (-i)
        }
        return s
    }
}

func binaryIndexedTree2d(_ rows: Int, _ cols: Int, _ matrix: [[Int]], _ operations: [[Int]]) -> [Int] {
    guard rows > 0, cols > 0 else { return [] }

    let bit = BIT2DDS(rows, cols)
    for r in 0..<min(rows, matrix.count) {
        for c in 0..<min(cols, matrix[r].count) {
            let value = matrix[r][c]
            if value != 0 {
                bit.update(r, c, value)
            }
        }
    }

    var results: [Int] = []
    for operation in operations {
        guard operation.count >= 4 else { continue }
        if operation[0] == 1 {
            bit.update(operation[1], operation[2], operation[3])
        } else if operation[0] == 2 {
            results.append(bit.query(operation[1], operation[2]))
        }
    }

    return results
}

let data = readLine()!.split(separator: " ").map { Int($0)! }
var idx = 0
let rows = data[idx]; idx += 1; let cols = data[idx]; idx += 1
let bit = BIT2DDS(rows, cols)
for r in 0..<rows { for c in 0..<cols { let v = data[idx]; idx += 1; if v != 0 { bit.update(r, c, v) } } }
let q = data[idx]; idx += 1
var results: [String] = []
for _ in 0..<q {
    let t = data[idx]; idx += 1; let r = data[idx]; idx += 1
    let c = data[idx]; idx += 1; let v = data[idx]; idx += 1
    if t == 1 { bit.update(r, c, v) } else { results.append(String(bit.query(r, c))) }
}
print(results.joined(separator: " "))
