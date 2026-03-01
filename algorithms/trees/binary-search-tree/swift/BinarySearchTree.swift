class BSTNode {
    let key: Int
    var left: BSTNode?
    var right: BSTNode?

    init(_ key: Int) {
        self.key = key
    }
}

func bstInorder(_ arr: [Int]) -> [Int] {
    func insert(_ root: BSTNode?, _ key: Int) -> BSTNode {
        guard let root = root else {
            return BSTNode(key)
        }
        if key <= root.key {
            root.left = insert(root.left, key)
        } else {
            root.right = insert(root.right, key)
        }
        return root
    }

    func inorder(_ root: BSTNode?, _ result: inout [Int]) {
        guard let root = root else { return }
        inorder(root.left, &result)
        result.append(root.key)
        inorder(root.right, &result)
    }

    var root: BSTNode? = nil
    for key in arr {
        root = insert(root, key)
    }

    var result: [Int] = []
    inorder(root, &result)
    return result
}
