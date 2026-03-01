/// Kosaraju's algorithm to find strongly connected components.
func findSccs(_ adjList: [Int: [Int]]) -> [[Int]] {
    findSCCs(adjList: adjList)
        .map { $0.sorted() }
        .sorted { lhs, rhs in
            (lhs.first ?? Int.max) < (rhs.first ?? Int.max)
        }
}

func findSCCs(adjList: [Int: [Int]]) -> [[Int]] {
    let numNodes = adjList.count
    var visited = Set<Int>()
    var finishOrder = [Int]()

    func dfs1(_ node: Int) {
        visited.insert(node)
        if let neighbors = adjList[node] {
            for neighbor in neighbors {
                if !visited.contains(neighbor) {
                    dfs1(neighbor)
                }
            }
        }
        finishOrder.append(node)
    }

    for i in 0..<numNodes {
        if !visited.contains(i) {
            dfs1(i)
        }
    }

    // Build reverse graph
    var revAdj = [Int: [Int]]()
    for node in adjList.keys {
        revAdj[node] = []
    }
    for (node, neighbors) in adjList {
        for neighbor in neighbors {
            if revAdj[neighbor] == nil { revAdj[neighbor] = [] }
            revAdj[neighbor]!.append(node)
        }
    }

    // Second DFS pass on reversed graph
    visited.removeAll()
    var components = [[Int]]()

    func dfs2(_ node: Int, _ component: inout [Int]) {
        visited.insert(node)
        component.append(node)
        if let neighbors = revAdj[node] {
            for neighbor in neighbors {
                if !visited.contains(neighbor) {
                    dfs2(neighbor, &component)
                }
            }
        }
    }

    for node in finishOrder.reversed() {
        if !visited.contains(node) {
            var component = [Int]()
            dfs2(node, &component)
            components.append(component)
        }
    }

    return components
}

// Example usage
let adjList: [Int: [Int]] = [
    0: [1],
    1: [2],
    2: [0, 3],
    3: [4],
    4: [3]
]

let components = findSCCs(adjList: adjList)
print("SCCs: \(components)")
