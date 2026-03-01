var adjCD = [[Int]]()
var removedCD = [Bool]()
var subSizeCD = [Int]()

func getSubSizeCD(_ v: Int, _ parent: Int) {
    subSizeCD[v] = 1
    for u in adjCD[v] {
        if u != parent && !removedCD[u] { getSubSizeCD(u, v); subSizeCD[v] += subSizeCD[u] }
    }
}

func getCentroidCD(_ v: Int, _ parent: Int, _ treeSize: Int) -> Int {
    for u in adjCD[v] {
        if u != parent && !removedCD[u] && subSizeCD[u] > treeSize / 2 {
            return getCentroidCD(u, v, treeSize)
        }
    }
    return v
}

func decomposeCD(_ v: Int, _ depth: Int) -> Int {
    getSubSizeCD(v, -1)
    let centroid = getCentroidCD(v, -1, subSizeCD[v])
    removedCD[centroid] = true
    var maxDepth = depth
    for u in adjCD[centroid] {
        if !removedCD[u] { let r = decomposeCD(u, depth + 1); if r > maxDepth { maxDepth = r } }
    }
    removedCD[centroid] = false
    return maxDepth
}

func centroidDecomposition(_ arr: [Int]) -> Int {
    var idx = 0
    let n = arr[idx]; idx += 1
    if n <= 1 { return 0 }

    adjCD = Array(repeating: [Int](), count: n)
    let m = (arr.count - 1) / 2
    for _ in 0..<m {
        let u = arr[idx]; idx += 1
        let v = arr[idx]; idx += 1
        adjCD[u].append(v); adjCD[v].append(u)
    }
    removedCD = Array(repeating: false, count: n)
    subSizeCD = Array(repeating: 0, count: n)
    return decomposeCD(0, 0)
}

print(centroidDecomposition([4, 0, 1, 1, 2, 2, 3]))
print(centroidDecomposition([5, 0, 1, 0, 2, 0, 3, 0, 4]))
print(centroidDecomposition([1]))
print(centroidDecomposition([7, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6]))
