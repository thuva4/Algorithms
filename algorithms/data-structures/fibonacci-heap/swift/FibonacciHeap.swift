class FibNode {
    var key: Int
    var degree: Int = 0
    var parent: FibNode? = nil
    var child: FibNode? = nil
    var left: FibNode!
    var right: FibNode!
    var mark: Bool = false

    init(_ key: Int) {
        self.key = key
        self.left = self
        self.right = self
    }
}

class FibHeap {
    var minNode: FibNode? = nil
    var n: Int = 0

    func insert(_ key: Int) {
        let node = FibNode(key)
        if minNode == nil {
            minNode = node
        } else {
            addToRootList(node)
            if node.key < minNode!.key { minNode = node }
        }
        n += 1
    }

    func extractMin() -> Int {
        guard let z = minNode else { return -1 }
        if let child = z.child {
            let children = getSiblings(child)
            for c in children {
                addToRootList(c)
                c.parent = nil
            }
        }
        removeFromList(z)
        if z === z.right {
            minNode = nil
        } else {
            minNode = z.right
            consolidate()
        }
        n -= 1
        return z.key
    }

    private func addToRootList(_ node: FibNode) {
        node.left = minNode!
        node.right = minNode!.right
        minNode!.right.left = node
        minNode!.right = node
    }

    private func removeFromList(_ node: FibNode) {
        node.left.right = node.right
        node.right.left = node.left
    }

    private func getSiblings(_ node: FibNode) -> [FibNode] {
        var sibs: [FibNode] = []
        var curr = node
        repeat {
            sibs.append(curr)
            curr = curr.right
        } while curr !== node
        return sibs
    }

    private func link(_ y: FibNode, _ x: FibNode) {
        removeFromList(y)
        y.left = y
        y.right = y
        if x.child == nil {
            x.child = y
        } else {
            y.left = x.child!
            y.right = x.child!.right
            x.child!.right.left = y
            x.child!.right = y
        }
        y.parent = x
        x.degree += 1
        y.mark = false
    }

    private func consolidate() {
        let maxDeg = Int(log2(Double(n))) + 2
        var A = [FibNode?](repeating: nil, count: maxDeg + 1)
        let roots = getSiblings(minNode!)
        for w in roots {
            var x = w
            var d = x.degree
            while d < A.count, let y = A[d] {
                var yy = y
                if x.key > yy.key { let t = x; x = yy; yy = t }
                link(yy, x)
                A[d] = nil
                d += 1
            }
            while d >= A.count { A.append(nil) }
            A[d] = x
        }
        minNode = nil
        for node in A {
            if let node = node {
                node.left = node
                node.right = node
                if minNode == nil {
                    minNode = node
                } else {
                    addToRootList(node)
                    if node.key < minNode!.key { minNode = node }
                }
            }
        }
    }
}

func fibonacciHeap(_ operations: [Int]) -> [Int] {
    let heap = FibHeap()
    var results: [Int] = []
    for op in operations {
        if op == 0 {
            results.append(heap.extractMin())
        } else {
            heap.insert(op)
        }
    }
    return results
}

print(fibonacciHeap([3, 1, 4, 0, 0]))
print(fibonacciHeap([5, 2, 8, 1, 0, 0, 0, 0]))
