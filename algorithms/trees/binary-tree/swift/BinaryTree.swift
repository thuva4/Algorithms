class TreeNode {
    var val: Int
    var left: TreeNode?
    var right: TreeNode?

    init(_ val: Int) {
        self.val = val
    }
}

func buildTree(_ arr: [Int?]) -> TreeNode? {
    if arr.isEmpty || arr[0] == nil { return nil }

    let root = TreeNode(arr[0]!)
    var queue = [root]
    var i = 1

    while !queue.isEmpty && i < arr.count {
        let node = queue.removeFirst()
        if i < arr.count, let val = arr[i] {
            node.left = TreeNode(val)
            queue.append(node.left!)
        }
        i += 1
        if i < arr.count, let val = arr[i] {
            node.right = TreeNode(val)
            queue.append(node.right!)
        }
        i += 1
    }
    return root
}

func levelOrderTraversal(_ arr: [Int?]) -> [Int] {
    guard let root = buildTree(arr) else { return [] }

    var result = [Int]()
    var queue = [root]

    while !queue.isEmpty {
        let node = queue.removeFirst()
        result.append(node.val)
        if let left = node.left { queue.append(left) }
        if let right = node.right { queue.append(right) }
    }
    return result
}

let arr: [Int?] = [1, 2, 3, 4, 5, 6, 7]
print("Level order: \(levelOrderTraversal(arr))")
