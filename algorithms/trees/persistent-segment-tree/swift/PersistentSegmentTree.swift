import Foundation

struct PSTNode { var val_: Int; var left: Int; var right: Int }

var pstNodes: [PSTNode] = []

func pstNewNode(_ v: Int, _ l: Int = 0, _ r: Int = 0) -> Int {
    pstNodes.append(PSTNode(val_: v, left: l, right: r)); return pstNodes.count - 1
}

func pstBuild(_ a: [Int], _ s: Int, _ e: Int) -> Int {
    if s == e { return pstNewNode(a[s]) }
    let m = (s + e) / 2
    let l = pstBuild(a, s, m), r = pstBuild(a, m + 1, e)
    return pstNewNode(pstNodes[l].val_ + pstNodes[r].val_, l, r)
}

func pstUpdate(_ nd: Int, _ s: Int, _ e: Int, _ idx: Int, _ val_: Int) -> Int {
    if s == e { return pstNewNode(val_) }
    let m = (s + e) / 2
    if idx <= m {
        let nl = pstUpdate(pstNodes[nd].left, s, m, idx, val_)
        return pstNewNode(pstNodes[nl].val_ + pstNodes[pstNodes[nd].right].val_, nl, pstNodes[nd].right)
    } else {
        let nr = pstUpdate(pstNodes[nd].right, m + 1, e, idx, val_)
        return pstNewNode(pstNodes[pstNodes[nd].left].val_ + pstNodes[nr].val_, pstNodes[nd].left, nr)
    }
}

func pstQuery(_ nd: Int, _ s: Int, _ e: Int, _ l: Int, _ r: Int) -> Int {
    if r < s || e < l { return 0 }
    if l <= s && e <= r { return pstNodes[nd].val_ }
    let m = (s + e) / 2
    return pstQuery(pstNodes[nd].left, s, m, l, r) + pstQuery(pstNodes[nd].right, m + 1, e, l, r)
}

func persistentSegmentTree(_ n: Int, _ array: [Int], _ operations: [[Int]]) -> [Int] {
    guard n > 0, !array.isEmpty else { return [] }

    pstNodes = []
    let baseArray = Array(array.prefix(n))
    var roots: [Int] = [pstBuild(baseArray, 0, n - 1)]
    var results: [Int] = []

    for operation in operations {
        guard operation.count >= 4 else { continue }
        if operation[0] == 1 {
            roots.append(pstUpdate(roots[operation[1]], 0, n - 1, operation[2], operation[3]))
        } else if operation[0] == 2 {
            results.append(pstQuery(roots[operation[1]], 0, n - 1, operation[2], operation[3]))
        }
    }

    return results
}

let data = readLine()!.split(separator: " ").map { Int($0)! }
var idx = 0
let n = data[idx]; idx += 1
let arr = Array(data[idx..<idx+n]); idx += n
var roots: [Int] = [pstBuild(arr, 0, n - 1)]
let q = data[idx]; idx += 1
var results: [String] = []
for _ in 0..<q {
    let t = data[idx]; idx += 1; let a1 = data[idx]; idx += 1
    let b1 = data[idx]; idx += 1; let c1 = data[idx]; idx += 1
    if t == 1 { roots.append(pstUpdate(roots[a1], 0, n - 1, b1, c1)) }
    else { results.append(String(pstQuery(roots[a1], 0, n - 1, b1, c1))) }
}
print(results.joined(separator: " "))
