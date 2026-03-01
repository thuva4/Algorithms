private class LruNode {
    var key: Int
    var value: Int
    var prev: LruNode?
    var next: LruNode?

    init(_ key: Int, _ value: Int) {
        self.key = key
        self.value = value
    }
}

private class LruCacheImpl {
    private let capacity: Int
    private var map: [Int: LruNode] = [:]
    private let head = LruNode(0, 0)
    private let tail = LruNode(0, 0)

    init(_ capacity: Int) {
        self.capacity = capacity
        head.next = tail
        tail.prev = head
    }

    private func removeNode(_ node: LruNode) {
        node.prev?.next = node.next
        node.next?.prev = node.prev
    }

    private func addToHead(_ node: LruNode) {
        node.next = head.next
        node.prev = head
        head.next?.prev = node
        head.next = node
    }

    func get(_ key: Int) -> Int {
        guard let node = map[key] else { return -1 }
        removeNode(node)
        addToHead(node)
        return node.value
    }

    func put(_ key: Int, _ value: Int) {
        if let existing = map[key] {
            existing.value = value
            removeNode(existing)
            addToHead(existing)
        } else {
            if map.count == capacity {
                let lru = tail.prev!
                removeNode(lru)
                map.removeValue(forKey: lru.key)
            }
            let node = LruNode(key, value)
            map[key] = node
            addToHead(node)
        }
    }
}

func lruCache(_ operations: [Int]) -> Int {
    let capacity = operations[0]
    let opCount = operations[1]
    let cache = LruCacheImpl(capacity)
    var resultSum = 0
    var idx = 2

    for _ in 0..<opCount {
        let opType = operations[idx]
        let key = operations[idx + 1]
        let value = operations[idx + 2]
        idx += 3

        if opType == 1 {
            cache.put(key, value)
        } else if opType == 2 {
            resultSum += cache.get(key)
        }
    }

    return resultSum
}
