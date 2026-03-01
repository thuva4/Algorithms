import Foundation

class SegTreeLazyDS {
    var tree: [Int]
    var lazy: [Int]
    var n: Int

    init(_ arr: [Int]) {
        n = arr.count
        tree = Array(repeating: 0, count: 4 * n)
        lazy = Array(repeating: 0, count: 4 * n)
        build(arr, 1, 0, n - 1)
    }

    func build(_ a: [Int], _ nd: Int, _ s: Int, _ e: Int) {
        if s == e { tree[nd] = a[s]; return }
        let m = (s + e) / 2
        build(a, 2*nd, s, m); build(a, 2*nd+1, m+1, e)
        tree[nd] = tree[2*nd] + tree[2*nd+1]
    }

    func applyNode(_ nd: Int, _ s: Int, _ e: Int, _ v: Int) {
        tree[nd] += v * (e - s + 1); lazy[nd] += v
    }

    func pushDown(_ nd: Int, _ s: Int, _ e: Int) {
        if lazy[nd] != 0 {
            let m = (s + e) / 2
            applyNode(2*nd, s, m, lazy[nd]); applyNode(2*nd+1, m+1, e, lazy[nd])
            lazy[nd] = 0
        }
    }

    func update(_ l: Int, _ r: Int, _ v: Int) { doUpdate(1, 0, n-1, l, r, v) }

    func doUpdate(_ nd: Int, _ s: Int, _ e: Int, _ l: Int, _ r: Int, _ v: Int) {
        if r < s || e < l { return }
        if l <= s && e <= r { applyNode(nd, s, e, v); return }
        pushDown(nd, s, e)
        let m = (s + e) / 2
        doUpdate(2*nd, s, m, l, r, v); doUpdate(2*nd+1, m+1, e, l, r, v)
        tree[nd] = tree[2*nd] + tree[2*nd+1]
    }

    func query(_ l: Int, _ r: Int) -> Int { return doQuery(1, 0, n-1, l, r) }

    func doQuery(_ nd: Int, _ s: Int, _ e: Int, _ l: Int, _ r: Int) -> Int {
        if r < s || e < l { return 0 }
        if l <= s && e <= r { return tree[nd] }
        pushDown(nd, s, e)
        let m = (s + e) / 2
        return doQuery(2*nd, s, m, l, r) + doQuery(2*nd+1, m+1, e, l, r)
    }
}

func segmentTreeLazy(_ n: Int, _ array: [Int], _ operations: [[Int]]) -> [Int] {
    guard n > 0, !array.isEmpty else { return [] }

    let st = SegTreeLazyDS(Array(array.prefix(n)))
    var results: [Int] = []

    for operation in operations {
        guard operation.count >= 4 else { continue }
        if operation[0] == 1 {
            st.update(operation[1], operation[2], operation[3])
        } else if operation[0] == 2 {
            results.append(st.query(operation[1], operation[2]))
        }
    }

    return results
}

let data = readLine()!.split(separator: " ").map { Int($0)! }
var idx = 0
let n = data[idx]; idx += 1
let arr = Array(data[idx..<idx+n]); idx += n
let st = SegTreeLazyDS(arr)
let q = data[idx]; idx += 1
var results: [String] = []
for _ in 0..<q {
    let t = data[idx]; idx += 1; let l = data[idx]; idx += 1
    let r = data[idx]; idx += 1; let v = data[idx]; idx += 1
    if t == 1 { st.update(l, r, v) }
    else { results.append(String(st.query(l, r))) }
}
print(results.joined(separator: " "))
