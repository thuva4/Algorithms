//A* Algorithm in Swift

class Node: Hashable, Equatable, CustomStringConvertible {
    
    let name: String
    let position: (x: Float, y: Float)
    var previous: Node?
    var neighbors: [(node: Node, cost: Float)] = []
    
    //g, h, f
    var gCost: Float = Float.infinity
    var heuristic: Float = 0
    var fValue: Float {
        return self.gCost + self.heuristic
    }
    
    init(name: String, position: (Float, Float)) {
        self.name = name
        self.position = position
    }
    func hash(into hasher: inout Hasher) {
        hasher.combine(self.name)
    }
    static func == (lhs: Node, rhs: Node) -> Bool {
        return lhs.hashValue == rhs.hashValue
    }
    var description: String {
        return "\(self.name) | gScore: \(self.gCost) | hScore: \(self.heuristic) | fScore: \(self.fValue)"
    }
}

func AStar(start: Node, goal: Node) -> [Node]?{
    
    start.gCost = 0
    var closedNodes = [Node]()
    //Initialize the open list with the start node appended
    var openNodes = [start]
    
    while !openNodes.isEmpty {
        
        //find the node with the smallest fValue and remove it from openNodes
        let currentNode = openNodes.removeFirst()
        
        //If the current node's position is the same as the goal node we are finished.
        if (currentNode.position.x == goal.position.x) && (currentNode.position.y == goal.position.y) {
            closedNodes.append(currentNode)
            var node: Node? = currentNode
            var path = [Node]()
            //iterate over previous nodes to get path from end to start
            while node != nil {
                path.append(node!)
                node = node!.previous
            }
            return path.reversed()
        }
        
        //process the current node's neigbhors/successors
        for neighbor in currentNode.neighbors {
            let neighborNode = neighbor.node
            let neighborCost = neighbor.cost
            
            //if neighborNode has already been visited and processed skip processing this node
            if closedNodes.contains(neighborNode) {
                continue
            }
            
            //check if neighbor is on the openlist, if so get that version and compare it to the current version score
            if openNodes.contains(neighborNode), let idx = openNodes.firstIndex(of: neighborNode) {
                let neighborOld = openNodes[idx]
                
                // if new movement score is lower(better) than the old version than replace
                // the old neighbor's previous node with the current node
                if currentNode.gCost + neighborCost < neighborOld.gCost {
                    neighborOld.previous = currentNode

                    //recalculate node's cost and sort open list based on the lowest fValue
                    neighborOld.gCost = neighborOld.previous!.gCost + neighborCost
                    openNodes.sort(by: {$0.fValue <= $1.fValue})
                }
            }
            else // neighbor is not on the open list
            {
                neighborNode.previous = currentNode
                neighborNode.gCost = neighborNode.previous!.gCost + neighborCost
                
                //calculate heuristic using distance formula
                let x = (goal.position.x - neighborNode.position.x) * 2
                let y = (goal.position.y - neighborNode.position.y) * 2
                let h = x + y
                neighborNode.heuristic = h.squareRoot()
                
                //add neighbor to openlist and resort based on lowest fValue
                openNodes.append(neighborNode)
                openNodes.sort(by: {$0.fValue <= $1.fValue})
            }
            //push the currentNode (one with the smallest fValue) onto the closed data structure
            closedNodes.append(currentNode)
        }
    }
    return nil
}

//Note: Positions are made up just so that the heuristic calculation matches the given graph taken from the Youtube Reference below
let s = Node(name: "S", position: (0.0,0.0))
let e = Node(name: "E", position: (25.0,25.0))

let a = Node(name: "A", position: (4.0,5.0))
let b = Node(name: "B", position: (13.0,12.0))
let c = Node(name: "C", position: (9.0,9.0))
let d = Node(name: "D", position: (3.0,15.0))
let f = Node(name: "F", position: (10.0,22.0))
let g = Node(name: "G", position: (24.0,21.0))
let h = Node(name: "H", position: (15.0,14.0))
let i = Node(name: "I", position: (20.0,22.0))
let j = Node(name: "J", position: (19.0,23.0))
let k = Node(name: "K", position: (22.0,23.0))
let l = Node(name: "L", position: (11.0,21.0))

a.neighbors = [(s,7), (d,4), (b,3)]
b.neighbors = [(s,2), (d,4), (a,3), (h,1)]
c.neighbors = [(s,3), (l,2)]
d.neighbors = [(a,4), (b,4), (f,5)]
e.neighbors = [(g,2), (k,5)]
f.neighbors = [(d,5), (h,3)]
g.neighbors = [(e,2), (h,2)]
h.neighbors = [(g,2), (b,1), (f,3)]
i.neighbors = [(l,4), (j,6), (k,4)]
j.neighbors = [(l,4), (i,6), (k,4)]
k.neighbors = [(j,4), (i,4), (e,5)]
l.neighbors = [(j,4), (i,4), (c,2)]
s.neighbors = [(a,7), (b,2), (c,3)]

AStar(start: s, goal: e)

/*
 Resulting Path:
 
 S -> B -> H -> G -> E
 */

//References
// https://www.youtube.com/watch?v=ySN5Wnu88nE&t=513s
// https://www.raywenderlich.com/1734-how-to-implement-a-pathfinding-with-swift
// https://www.geeksforgeeks.org/a-search-algorithm/
