//Dijkstra Algorithm in Swift

class Node: Hashable, Equatable {
  
    let name: String
    var neighbors: [(node: Node, cost: Int)] = []

    var distanceFromSource: Int = Int.max
    var pathFromSource: [String] = []

    init(name: String) {
        self.name = name
    }
    func hash(into hasher: inout Hasher) {
        hasher.combine(self.name)
    }
    static func == (lhs: Node, rhs: Node) -> Bool {
        return lhs.hashValue == rhs.hashValue
    }
}

func Dijkstra(graph: Set<Node>, source: Node)  {
    var unvisitedNodes = graph
    
    //set the source node's distance to zero
    source.distanceFromSource = 0
    var currentNode: Node? = source
    
    while !unvisitedNodes.isEmpty {
        if let visitedNode = currentNode {
            
            for neigbhor in visitedNode.neighbors {
                let neighborNode = neigbhor.node
                let neighborCost = neigbhor.cost
                
                //Add the node's total distance/cost from source with the current neighbors cost
                let calculatedDistance = visitedNode.distanceFromSource + neighborCost
                let knownDistance = neigbhor.node.distanceFromSource
                
                //if calculated distance is less than known distance of neighbor than update the neigbhor's distance
                if calculatedDistance < knownDistance {
                    neighborNode.distanceFromSource = calculatedDistance
                    neighborNode.pathFromSource = visitedNode.pathFromSource
                    neighborNode.pathFromSource.append(visitedNode.name)
                }
            }
            
            // add visited to its own path
            visitedNode.pathFromSource.append(visitedNode.name)
            // remove node as we have already visited it
            unvisitedNodes.remove(visitedNode)
            
            // visit the unvisited node with the shortest distance from the source
            currentNode = unvisitedNodes.min(by: { $0.distanceFromSource < $1.distanceFromSource})
        }
    }
}

let a = Node(name: "A")
let b = Node(name: "B")
let c = Node(name: "C")
let d = Node(name: "D")
let e = Node(name: "E")

a.neighbors = [(d,1), (b,6)]
b.neighbors = [(a,6), (d,2), (e,2), (c,5)]
c.neighbors = [(b,5), (e,5)]
d.neighbors = [(a,1),(b,2), (e,1)]
e.neighbors = [(d,1), (b,2), (c,5)]


//  A -- 6 -- B
//  |       / | \
//  |      /  |  5
//  |     /   |   \
//  1    2    2     C
//  |   /     |   /
//  |  /      |  5
//  | /       | /
//  D -- 1 -- E


var graph = Set<Node>([a,b,c,d,e])

Dijkstra(graph: graph, source: a)

a.distanceFromSource // 0
b.distanceFromSource // 3
c.distanceFromSource // 7
d.distanceFromSource // 1
e.distanceFromSource // 2

a.pathFromSource // A
b.pathFromSource // A, D, B
c.pathFromSource // A, D, E, C
d.pathFromSource // A, D
e.pathFromSource // A, D, E

//References
//  https://www.youtube.com/watch?v=pVfj6mxhdMw&t=228s
//  https://github.com/raywenderlich/swift-algorithm-club/blob/master/Dijkstra%20Algorithm/Dijkstra.playground/Sources/Dijkstra.swift
