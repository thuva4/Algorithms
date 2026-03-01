private let T_ORDER = 3
private let MAX_KEYS = 2 * T_ORDER - 1

private class BTreeNode {
    var keys: [Int] = []
    var children: [BTreeNode] = []
    var leaf: Bool

    init(leaf: Bool = true) {
        self.leaf = leaf
    }
}

private func splitChild(_ parent: BTreeNode, _ i: Int) {
    let full = parent.children[i]
    let newNode = BTreeNode(leaf: full.leaf)
    let mid = T_ORDER - 1
    newNode.keys = Array(full.keys[T_ORDER...])
    let median = full.keys[mid]
    if !full.leaf {
        newNode.children = Array(full.children[T_ORDER...])
        full.children = Array(full.children[..<T_ORDER])
    }
    full.keys = Array(full.keys[..<mid])
    parent.keys.insert(median, at: i)
    parent.children.insert(newNode, at: i + 1)
}

private func insertNonFull(_ node: BTreeNode, _ key: Int) {
    if node.leaf {
        let pos = node.keys.firstIndex(where: { $0 > key }) ?? node.keys.count
        node.keys.insert(key, at: pos)
    } else {
        var i = node.keys.count - 1
        while i >= 0 && key < node.keys[i] { i -= 1 }
        i += 1
        if node.children[i].keys.count == MAX_KEYS {
            splitChild(node, i)
            if key > node.keys[i] { i += 1 }
        }
        insertNonFull(node.children[i], key)
    }
}

private func inorder(_ node: BTreeNode?, _ result: inout [Int]) {
    guard let node = node else { return }
    for i in 0..<node.keys.count {
        if !node.leaf { inorder(node.children[i], &result) }
        result.append(node.keys[i])
    }
    if !node.leaf { inorder(node.children[node.keys.count], &result) }
}

func bTree(_ arr: [Int]) -> [Int] {
    if arr.isEmpty { return [] }
    var root = BTreeNode(leaf: true)
    for val in arr {
        if root.keys.count == MAX_KEYS {
            let newRoot = BTreeNode(leaf: false)
            newRoot.children.append(root)
            splitChild(newRoot, 0)
            root = newRoot
        }
        insertNonFull(root, val)
    }
    var result: [Int] = []
    inorder(root, &result)
    return result
}
