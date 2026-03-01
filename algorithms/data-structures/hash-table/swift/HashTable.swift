private class HashTableImpl {
    private let size: Int
    private var buckets: [[(key: Int, value: Int)]]

    init(_ size: Int = 64) {
        self.size = size
        self.buckets = Array(repeating: [], count: size)
    }

    private func hash(_ key: Int) -> Int {
        return abs(key) % size
    }

    func put(_ key: Int, _ value: Int) {
        let idx = hash(key)
        for i in 0..<buckets[idx].count {
            if buckets[idx][i].key == key {
                buckets[idx][i].value = value
                return
            }
        }
        buckets[idx].append((key: key, value: value))
    }

    func get(_ key: Int) -> Int {
        let idx = hash(key)
        for entry in buckets[idx] {
            if entry.key == key {
                return entry.value
            }
        }
        return -1
    }

    func delete(_ key: Int) {
        let idx = hash(key)
        buckets[idx].removeAll { $0.key == key }
    }
}

func hashTableOps(_ operations: [Int]) -> Int {
    let table = HashTableImpl()
    let opCount = operations[0]
    var resultSum = 0
    var idx = 1

    for _ in 0..<opCount {
        let opType = operations[idx]
        let key = operations[idx + 1]
        let value = operations[idx + 2]
        idx += 3

        switch opType {
        case 1:
            table.put(key, value)
        case 2:
            resultSum += table.get(key)
        case 3:
            table.delete(key)
        default:
            break
        }
    }

    return resultSum
}
