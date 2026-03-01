private let MAX_LVL = 16

private class SkipNode {
    var key: Int
    var forward: [SkipNode?]
    init(_ key: Int, _ level: Int) {
        self.key = key
        self.forward = [SkipNode?](repeating: nil, count: level + 1)
    }
}

func skipList(_ arr: [Int]) -> [Int] {
    let header = SkipNode(Int.min, MAX_LVL)
    var level = 0

    for val in arr {
        var update = [SkipNode?](repeating: nil, count: MAX_LVL + 1)
        var current = header
        for i in stride(from: level, through: 0, by: -1) {
            while let fwd = current.forward[i], fwd.key < val {
                current = fwd
            }
            update[i] = current
        }
        if let next = current.forward[0], next.key == val { continue }

        var newLevel = 0
        while Bool.random() && newLevel < MAX_LVL { newLevel += 1 }
        if newLevel > level {
            for i in (level + 1)...newLevel { update[i] = header }
            level = newLevel
        }
        let newNode = SkipNode(val, newLevel)
        for i in 0...newLevel {
            newNode.forward[i] = update[i]!.forward[i]
            update[i]!.forward[i] = newNode
        }
    }

    var result: [Int] = []
    var node = header.forward[0]
    while let n = node {
        result.append(n.key)
        node = n.forward[0]
    }
    return result
}
