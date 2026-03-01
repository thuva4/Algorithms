class TreeSort {
    private class Node {
        var key: Int
        var left: Node?
        var right: Node?
        
        init(_ key: Int) {
            self.key = key
            self.left = nil
            self.right = nil
        }
    }
    
    static func sort(_ arr: inout [Int]) {
        var root: Node? = nil
        for value in arr {
            root = insert(root, value)
        }
        
        var index = 0
        storeSorted(root, &arr, &index)
    }
    
    private static func insert(_ root: Node?, _ key: Int) -> Node {
        guard let root = root else {
            return Node(key)
        }
        
        if key < root.key {
            root.left = insert(root.left, key)
        } else {
            root.right = insert(root.right, key)
        }
        
        return root
    }
    
    private static func storeSorted(_ root: Node?, _ arr: inout [Int], _ index: inout Int) {
        if let root = root {
            storeSorted(root.left, &arr, &index)
            arr[index] = root.key
            index += 1
            storeSorted(root.right, &arr, &index)
        }
    }
}
