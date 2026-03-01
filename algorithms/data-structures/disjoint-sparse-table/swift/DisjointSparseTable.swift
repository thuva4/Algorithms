import Foundation

struct DisjointSparseTableDS {
    var table: [[Int]]
    var a: [Int]
    var sz: Int
    var levels: Int

    init(_ arr: [Int]) {
        let n = arr.count
        sz = 1; levels = 0
        while sz < n { sz <<= 1; levels += 1 }
        if levels == 0 { levels = 1 }
        a = arr + Array(repeating: 0, count: sz - n)
        table = Array(repeating: Array(repeating: 0, count: sz), count: levels)

        for level in 0..<levels {
            let block = 1 << (level + 1)
            let half = block >> 1
            var start = 0
            while start < sz {
                let mid = start + half
                table[level][mid] = a[mid]
                let end = min(start + block, sz)
                for i in (mid + 1)..<end {
                    table[level][i] = table[level][i - 1] + a[i]
                }
                if mid - 1 >= start {
                    table[level][mid - 1] = a[mid - 1]
                    if mid >= 2 {
                        for i in stride(from: mid - 2, through: start, by: -1) {
                            table[level][i] = table[level][i + 1] + a[i]
                        }
                    }
                }
                start += block
            }
        }
    }

    func query(_ l: Int, _ r: Int) -> Int {
        if l == r { return a[l] }
        var xor = l ^ r
        var level = 0
        while (1 << (level + 1)) <= xor { level += 1 }
        return table[level][l] + table[level][r]
    }
}

func disjointSparseTable(_ n: Int, _ array: [Int], _ queries: [[Int]]) -> [Int] {
    if n <= 0 || array.isEmpty { return [] }
    if n == 1 {
        let value = array[0]
        return queries.map { _ in value }
    }
    let table = DisjointSparseTableDS(Array(array.prefix(n)))
    return queries.map { query in
        guard query.count >= 2 else { return 0 }
        return table.query(query[0], query[1])
    }
}

let data = readLine()!.split(separator: " ").map { Int($0)! }
var idx = 0
let n = data[idx]; idx += 1
let arr = Array(data[idx..<idx+n]); idx += n
let dst = DisjointSparseTableDS(arr)
let q = data[idx]; idx += 1
var results: [String] = []
for _ in 0..<q {
    let l = data[idx]; idx += 1
    let r = data[idx]; idx += 1
    results.append(String(dst.query(l, r)))
}
print(results.joined(separator: " "))
