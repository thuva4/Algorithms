class AvlNode {
    var key: Int
    var left: AvlNode?
    var right: AvlNode?
    var height: Int

    init(_ key: Int) {
        self.key = key
        self.left = nil
        self.right = nil
        self.height = 1
    }
}

func nodeHeight(_ node: AvlNode?) -> Int {
    return node?.height ?? 0
}

func updateHeight(_ node: AvlNode) {
    node.height = 1 + max(nodeHeight(node.left), nodeHeight(node.right))
}

func balanceFactor(_ node: AvlNode) -> Int {
    return nodeHeight(node.left) - nodeHeight(node.right)
}

func rotateRight(_ y: AvlNode) -> AvlNode {
    let x = y.left!
    let t2 = x.right
    x.right = y
    y.left = t2
    updateHeight(y)
    updateHeight(x)
    return x
}

func rotateLeft(_ x: AvlNode) -> AvlNode {
    let y = x.right!
    let t2 = y.left
    y.left = x
    x.right = t2
    updateHeight(x)
    updateHeight(y)
    return y
}

func insertNode(_ node: AvlNode?, _ key: Int) -> AvlNode {
    guard let node = node else { return AvlNode(key) }
    if key < node.key { node.left = insertNode(node.left, key) }
    else if key > node.key { node.right = insertNode(node.right, key) }
    else { return node }

    updateHeight(node)
    let bf = balanceFactor(node)

    if bf > 1 && key < node.left!.key { return rotateRight(node) }
    if bf < -1 && key > node.right!.key { return rotateLeft(node) }
    if bf > 1 && key > node.left!.key {
        node.left = rotateLeft(node.left!)
        return rotateRight(node)
    }
    if bf < -1 && key < node.right!.key {
        node.right = rotateRight(node.right!)
        return rotateLeft(node)
    }

    return node
}

func inorderTraversal(_ node: AvlNode?, _ result: inout [Int]) {
    guard let node = node else { return }
    inorderTraversal(node.left, &result)
    result.append(node.key)
    inorderTraversal(node.right, &result)
}

func avlInsertInorder(_ arr: [Int]) -> [Int] {
    var root: AvlNode? = nil
    for val in arr {
        root = insertNode(root, val)
    }
    var result: [Int] = []
    inorderTraversal(root, &result)
    return result
}
