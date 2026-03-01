/// A* search algorithm to find shortest path from start to goal.
/// Returns (path, cost).
func aStar(adjList: [Int: [[Int]]], start: Int, goal: Int, heuristic: [Int: Int]) -> (path: [Int], cost: Double) {
    if start == goal {
        return ([start], 0)
    }

    var gScore = [Int: Double]()
    var cameFrom = [Int: Int]()
    var closedSet = Set<Int>()

    for node in adjList.keys {
        gScore[node] = Double.infinity
    }
    gScore[start] = 0

    // Simple priority queue using array (sorted insertion)
    var openSet: [(fScore: Double, node: Int)] = [(Double(heuristic[start] ?? 0), start)]

    while !openSet.isEmpty {
        // Get node with minimum fScore
        openSet.sort { $0.fScore < $1.fScore }
        let current = openSet.removeFirst()
        let currentNode = current.node

        if currentNode == goal {
            // Reconstruct path
            var path = [Int]()
            var node = goal
            while let prev = cameFrom[node] {
                path.insert(node, at: 0)
                node = prev
            }
            path.insert(node, at: 0)
            return (path, gScore[goal]!)
        }

        if closedSet.contains(currentNode) { continue }
        closedSet.insert(currentNode)

        if let neighbors = adjList[currentNode] {
            for edge in neighbors {
                let neighbor = edge[0]
                let weight = edge[1]

                if closedSet.contains(neighbor) { continue }

                let tentativeG = gScore[currentNode]! + Double(weight)
                if tentativeG < (gScore[neighbor] ?? Double.infinity) {
                    cameFrom[neighbor] = currentNode
                    gScore[neighbor] = tentativeG
                    let fScore = tentativeG + Double(heuristic[neighbor] ?? 0)
                    openSet.append((fScore, neighbor))
                }
            }
        }
    }

    return ([], Double.infinity)
}

func aStarSearch(_ arr: [Int]) -> Int {
    if arr.count < 2 { return -1 }

    let n = arr[0]
    let m = arr[1]
    let expectedCount = 2 + (3 * m) + n + 2
    if n <= 0 || arr.count < expectedCount { return -1 }

    var index = 2
    var adjList: [Int: [[Int]]] = [:]
    for node in 0..<n {
        adjList[node] = []
    }

    for _ in 0..<m {
        let u = arr[index]
        let v = arr[index + 1]
        let w = arr[index + 2]
        index += 3
        adjList[u, default: []].append([v, w])
    }

    let start = arr[index]
    let goal = arr[index + 1]
    index += 2

    var heuristic: [Int: Int] = [:]
    for node in 0..<n {
        heuristic[node] = arr[index]
        index += 1
    }

    let result = aStar(adjList: adjList, start: start, goal: goal, heuristic: heuristic)
    return result.cost.isInfinite ? -1 : Int(result.cost)
}

// Example usage
let adjList: [Int: [[Int]]] = [
    0: [[1, 1], [2, 4]],
    1: [[2, 2], [3, 6]],
    2: [[3, 3]],
    3: []
]
let heuristic = [0: 5, 1: 4, 2: 2, 3: 0]

let result = aStar(adjList: adjList, start: 0, goal: 3, heuristic: heuristic)
print("Path: \(result.path), Cost: \(result.cost)")
