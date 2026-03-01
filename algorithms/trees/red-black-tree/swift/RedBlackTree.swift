class RBNode {
    var key: Int
    var left: RBNode?
    var right: RBNode?
    var parent: RBNode?
    var isRed: Bool

    init(_ key: Int) {
        self.key = key
        self.left = nil
        self.right = nil
        self.parent = nil
        self.isRed = true
    }
}

func rbInsertInorder(_ arr: [Int]) -> [Int] {
    var root: RBNode? = nil

    func rotateLeft(_ x: RBNode) {
        let y = x.right!
        x.right = y.left
        if y.left != nil { y.left!.parent = x }
        y.parent = x.parent
        if x.parent == nil { root = y }
        else if x === x.parent!.left { x.parent!.left = y }
        else { x.parent!.right = y }
        y.left = x
        x.parent = y
    }

    func rotateRight(_ x: RBNode) {
        let y = x.left!
        x.left = y.right
        if y.right != nil { y.right!.parent = x }
        y.parent = x.parent
        if x.parent == nil { root = y }
        else if x === x.parent!.right { x.parent!.right = y }
        else { x.parent!.left = y }
        y.right = x
        x.parent = y
    }

    func fixInsert(_ node: RBNode) {
        var z = node
        while z.parent != nil && z.parent!.isRed {
            let gp = z.parent!.parent!
            if z.parent === gp.left {
                let y = gp.right
                if y != nil && y!.isRed {
                    z.parent!.isRed = false
                    y!.isRed = false
                    gp.isRed = true
                    z = gp
                } else {
                    if z === z.parent!.right {
                        z = z.parent!
                        rotateLeft(z)
                    }
                    z.parent!.isRed = false
                    z.parent!.parent!.isRed = true
                    rotateRight(z.parent!.parent!)
                }
            } else {
                let y = gp.left
                if y != nil && y!.isRed {
                    z.parent!.isRed = false
                    y!.isRed = false
                    gp.isRed = true
                    z = gp
                } else {
                    if z === z.parent!.left {
                        z = z.parent!
                        rotateRight(z)
                    }
                    z.parent!.isRed = false
                    z.parent!.parent!.isRed = true
                    rotateLeft(z.parent!.parent!)
                }
            }
        }
        root!.isRed = false
    }

    func insert(_ key: Int) {
        var y: RBNode? = nil
        var x = root
        while x != nil {
            y = x
            if key < x!.key { x = x!.left }
            else if key > x!.key { x = x!.right }
            else { return }
        }
        let node = RBNode(key)
        node.parent = y
        if y == nil { root = node }
        else if key < y!.key { y!.left = node }
        else { y!.right = node }
        fixInsert(node)
    }

    func inorder(_ node: RBNode?, _ result: inout [Int]) {
        guard let node = node else { return }
        inorder(node.left, &result)
        result.append(node.key)
        inorder(node.right, &result)
    }

    for val in arr { insert(val) }
    var result: [Int] = []
    inorder(root, &result)
    return result
}
