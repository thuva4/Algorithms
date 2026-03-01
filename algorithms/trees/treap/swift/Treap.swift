private class TreapNode {
    var key: Int
    var priority: Int
    var left: TreapNode?
    var right: TreapNode?
    init(_ key: Int) {
        self.key = key
        self.priority = Int.random(in: 0..<Int.max)
        self.left = nil
        self.right = nil
    }
}

private func rightRot(_ p: TreapNode) -> TreapNode {
    let q = p.left!
    p.left = q.right
    q.right = p
    return q
}

private func leftRot(_ p: TreapNode) -> TreapNode {
    let q = p.right!
    p.right = q.left
    q.left = p
    return q
}

private func insertNode(_ root: TreapNode?, _ key: Int) -> TreapNode {
    guard var node = root else { return TreapNode(key) }
    if key < node.key {
        node.left = insertNode(node.left, key)
        if node.left!.priority > node.priority { node = rightRot(node) }
    } else if key > node.key {
        node.right = insertNode(node.right, key)
        if node.right!.priority > node.priority { node = leftRot(node) }
    }
    return node
}

private func inorderCollect(_ node: TreapNode?, _ result: inout [Int]) {
    guard let node = node else { return }
    inorderCollect(node.left, &result)
    result.append(node.key)
    inorderCollect(node.right, &result)
}

func treap(_ arr: [Int]) -> [Int] {
    var root: TreapNode? = nil
    for val in arr { root = insertNode(root, val) }
    var result: [Int] = []
    inorderCollect(root, &result)
    return result
}
