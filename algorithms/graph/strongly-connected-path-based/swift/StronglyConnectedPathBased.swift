func stronglyConnectedPathBased(_ arr: [Int]) -> Int {
    let n = arr[0]; let m = arr[1]
    var adj = [[Int]](repeating: [], count: n)
    for i in 0..<m { adj[arr[2 + 2 * i]].append(arr[2 + 2 * i + 1]) }

    var preorder = [Int](repeating: -1, count: n)
    var counter = 0; var sccCount = 0
    var sStack = [Int](); var pStack = [Int]()
    var assigned = [Bool](repeating: false, count: n)

    func dfs(_ v: Int) {
        preorder[v] = counter; counter += 1
        sStack.append(v); pStack.append(v)
        for w in adj[v] {
            if preorder[w] == -1 { dfs(w) }
            else if !assigned[w] {
                while !pStack.isEmpty && preorder[pStack.last!] > preorder[w] { pStack.removeLast() }
            }
        }
        if !pStack.isEmpty && pStack.last! == v {
            pStack.removeLast(); sccCount += 1
            while true {
                let u = sStack.removeLast(); assigned[u] = true
                if u == v { break }
            }
        }
    }

    for v in 0..<n { if preorder[v] == -1 { dfs(v) } }
    return sccCount
}
