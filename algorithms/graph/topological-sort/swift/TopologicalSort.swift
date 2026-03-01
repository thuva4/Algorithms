/// Topological sort of a directed acyclic graph using DFS.
/// Returns an array of nodes in topological order.
func topologicalSort(adjList: [Int: [Int]]) -> [Int] {
    var visited = Set<Int>()
    var stack = [Int]()

    func dfs(_ node: Int) {
        visited.insert(node)

        if let neighbors = adjList[node] {
            for neighbor in neighbors.reversed() {
                if !visited.contains(neighbor) {
                    dfs(neighbor)
                }
            }
        }

        stack.append(node)
    }

    // Process all nodes in order
    for i in stride(from: adjList.count - 1, through: 0, by: -1) {
        if !visited.contains(i) {
            dfs(i)
        }
    }

    return stack.reversed()
}

// Example usage
let adjList: [Int: [Int]] = [
    0: [1, 2],
    1: [3],
    2: [3],
    3: []
]

let result = topologicalSort(adjList: adjList)
print("Topological order: \(result)")
