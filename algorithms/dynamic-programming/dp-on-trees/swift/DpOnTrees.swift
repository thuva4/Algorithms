import Foundation

func dpOnTrees(_ n: Int, _ values: [Int], _ edges: [[Int]]) -> Int {
    if n == 0 { return 0 }
    if n == 1 { return values[0] }

    var adj = [[Int]](repeating: [], count: n)
    for e in edges {
        adj[e[0]].append(e[1])
        adj[e[1]].append(e[0])
    }

    var dp = [Int](repeating: 0, count: n)
    var parent = [Int](repeating: -1, count: n)
    var visited = [Bool](repeating: false, count: n)

    var order = [Int]()
    var queue = [Int]()
    queue.append(0)
    visited[0] = true
    var front = 0
    while front < queue.count {
        let node = queue[front]
        front += 1
        order.append(node)
        for child in adj[node] {
            if !visited[child] {
                visited[child] = true
                parent[child] = node
                queue.append(child)
            }
        }
    }

    for i in stride(from: order.count - 1, through: 0, by: -1) {
        let node = order[i]
        var bestChild = 0
        for child in adj[node] {
            if child != parent[node] {
                bestChild = max(bestChild, dp[child])
            }
        }
        dp[node] = values[node] + bestChild
    }

    return dp.max()!
}

let n = Int(readLine()!)!
let values = readLine()!.split(separator: " ").map { Int($0)! }
var edges = [[Int]]()
for _ in 0..<max(0, n - 1) {
    edges.append(readLine()!.split(separator: " ").map { Int($0)! })
}
print(dpOnTrees(n, values, edges))
