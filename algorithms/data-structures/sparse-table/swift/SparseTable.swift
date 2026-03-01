import Foundation

struct SparseTableDS {
    var table: [[Int]]
    var lg: [Int]

    init(_ arr: [Int]) {
        let n = arr.count
        var k = 1
        while (1 << k) <= n { k += 1 }
        table = Array(repeating: Array(repeating: 0, count: n), count: k)
        lg = Array(repeating: 0, count: n + 1)
        for i in 2...max(2, n) { lg[i] = lg[i / 2] + 1 }
        table[0] = arr
        for j in 1..<k {
            for i in 0...(n - (1 << j)) {
                table[j][i] = min(table[j-1][i], table[j-1][i + (1 << (j-1))])
            }
        }
    }

    func query(_ l: Int, _ r: Int) -> Int {
        let k = lg[r - l + 1]
        return min(table[k][l], table[k][r - (1 << k) + 1])
    }
}

func sparseTable(_ n: Int, _ array: [Int], _ queries: [[Int]]) -> [Int] {
    if n <= 0 || array.isEmpty { return [] }
    if n == 1 {
        let value = array[0]
        return queries.map { _ in value }
    }
    let table = SparseTableDS(Array(array.prefix(n)))
    return queries.map { query in
        guard query.count >= 2 else { return 0 }
        return table.query(query[0], query[1])
    }
}

let data = readLine()!.split(separator: " ").map { Int($0)! }
var idx = 0
let n = data[idx]; idx += 1
let arr = Array(data[idx..<idx+n]); idx += n
let st = SparseTableDS(arr)
let q = data[idx]; idx += 1
var results: [String] = []
for _ in 0..<q {
    let l = data[idx]; idx += 1
    let r = data[idx]; idx += 1
    results.append(String(st.query(l, r)))
}
print(results.joined(separator: " "))
