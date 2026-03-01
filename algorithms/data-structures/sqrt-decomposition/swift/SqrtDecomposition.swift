import Foundation

struct SqrtDecompositionDS {
    var a: [Int]
    var blocks: [Int]
    var blockSz: Int

    init(_ arr: [Int]) {
        a = arr
        let n = arr.count
        blockSz = max(1, Int(Double(n).squareRoot()))
        blocks = Array(repeating: 0, count: (n + blockSz - 1) / blockSz)
        for i in 0..<n { blocks[i / blockSz] += arr[i] }
    }

    func query(_ l: Int, _ r: Int) -> Int {
        var result = 0
        let bl = l / blockSz, br = r / blockSz
        if bl == br {
            for i in l...r { result += a[i] }
        } else {
            for i in l..<((bl + 1) * blockSz) { result += a[i] }
            for b in (bl + 1)..<br { result += blocks[b] }
            for i in (br * blockSz)...r { result += a[i] }
        }
        return result
    }
}

func sqrtDecomposition(_ n: Int, _ array: [Int], _ queries: [[Int]]) -> [Int] {
    if n <= 0 || array.isEmpty { return [] }
    let table = SqrtDecompositionDS(Array(array.prefix(n)))
    return queries.map { query in
        guard query.count >= 2 else { return 0 }
        return table.query(query[0], query[1])
    }
}

let data = readLine()!.split(separator: " ").map { Int($0)! }
var idx = 0
let n = data[idx]; idx += 1
let arr = Array(data[idx..<idx+n]); idx += n
let sd = SqrtDecompositionDS(arr)
let q = data[idx]; idx += 1
var results: [String] = []
for _ in 0..<q {
    let l = data[idx]; idx += 1
    let r = data[idx]; idx += 1
    results.append(String(sd.query(l, r)))
}
print(results.joined(separator: " "))
