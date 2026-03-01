private class SNode {
    var key: Int
    var left: SNode?
    var right: SNode?
    init(_ key: Int) { self.key = key; self.left = nil; self.right = nil }
}

private func rightRotate(_ x: SNode) -> SNode {
    let y = x.left!
    x.left = y.right
    y.right = x
    return y
}

private func leftRotate(_ x: SNode) -> SNode {
    let y = x.right!
    x.right = y.left
    y.left = x
    return y
}

private func splayOp(_ root: SNode?, _ key: Int) -> SNode? {
    guard let root = root else { return nil }
    if root.key == key { return root }
    if key < root.key {
        guard root.left != nil else { return root }
        if key < root.left!.key {
            root.left!.left = splayOp(root.left!.left, key)
            let r = rightRotate(root)
            return r
        } else if key > root.left!.key {
            root.left!.right = splayOp(root.left!.right, key)
            if root.left!.right != nil { root.left = leftRotate(root.left!) }
        }
        return root.left == nil ? root : rightRotate(root)
    } else {
        guard root.right != nil else { return root }
        if key > root.right!.key {
            root.right!.right = splayOp(root.right!.right, key)
            let r = leftRotate(root)
            return r
        } else if key < root.right!.key {
            root.right!.left = splayOp(root.right!.left, key)
            if root.right!.left != nil { root.right = rightRotate(root.right!) }
        }
        return root.right == nil ? root : leftRotate(root)
    }
}

private func insertNode(_ root: SNode?, _ key: Int) -> SNode {
    guard let root = root else { return SNode(key) }
    let r = splayOp(root, key)!
    if r.key == key { return r }
    let node = SNode(key)
    if key < r.key {
        node.right = r
        node.left = r.left
        r.left = nil
    } else {
        node.left = r
        node.right = r.right
        r.right = nil
    }
    return node
}

private func inorderCollect(_ node: SNode?, _ result: inout [Int]) {
    guard let node = node else { return }
    inorderCollect(node.left, &result)
    result.append(node.key)
    inorderCollect(node.right, &result)
}

func splayTree(_ arr: [Int]) -> [Int] {
    var root: SNode? = nil
    for val in arr { root = insertNode(root, val) }
    var result: [Int] = []
    inorderCollect(root, &result)
    return result.sorted()
}
