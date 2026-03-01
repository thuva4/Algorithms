import Foundation

class MergeSortTreeDS {
    var tree: [[Int]]
    var n: Int

    init(_ arr: [Int]) {
        n = arr.count
        tree = Array(repeating: [Int](), count: 4 * n)
        build(arr, 1, 0, n - 1)
    }

    func build(_ a: [Int], _ nd: Int, _ s: Int, _ e: Int) {
        if s == e { tree[nd] = [a[s]]; return }
        let m = (s + e) / 2
        build(a, 2*nd, s, m); build(a, 2*nd+1, m+1, e)
        tree[nd] = mergeSorted(tree[2*nd], tree[2*nd+1])
    }

    func mergeSorted(_ a: [Int], _ b: [Int]) -> [Int] {
        var r = [Int](); var i = 0, j = 0
        while i < a.count && j < b.count {
            if a[i] <= b[j] { r.append(a[i]); i += 1 } else { r.append(b[j]); j += 1 }
        }
        r.append(contentsOf: a[i...]); r.append(contentsOf: b[j...])
        return r
    }

    func upperBound(_ arr: [Int], _ k: Int) -> Int {
        var lo = 0, hi = arr.count
        while lo < hi { let m = (lo + hi) / 2; if arr[m] <= k { lo = m + 1 } else { hi = m } }
        return lo
    }

    func countLeq(_ l: Int, _ r: Int, _ k: Int) -> Int { return query(1, 0, n-1, l, r, k) }

    func query(_ nd: Int, _ s: Int, _ e: Int, _ l: Int, _ r: Int, _ k: Int) -> Int {
        if r < s || e < l { return 0 }
        if l <= s && e <= r { return upperBound(tree[nd], k) }
        let m = (s + e) / 2
        return query(2*nd, s, m, l, r, k) + query(2*nd+1, m+1, e, l, r, k)
    }
}

func mergeSortTree(_ n: Int, _ array: [Int], _ queries: [[Int]]) -> [Int] {
    if n <= 0 || array.isEmpty { return [] }
    let tree = MergeSortTreeDS(Array(array.prefix(n)))
    return queries.map { query in
        guard query.count >= 3 else { return 0 }
        return tree.countLeq(query[0], query[1], query[2])
    }
}

let data = readLine()!.split(separator: " ").map { Int($0)! }
var idx = 0
let n = data[idx]; idx += 1
let arr = Array(data[idx..<idx+n]); idx += n
let mst = MergeSortTreeDS(arr)
let q = data[idx]; idx += 1
var results: [String] = []
for _ in 0..<q {
    let l = data[idx]; idx += 1; let r = data[idx]; idx += 1; let k = data[idx]; idx += 1
    results.append(String(mst.countLeq(l, r, k)))
}
print(results.joined(separator: " "))
