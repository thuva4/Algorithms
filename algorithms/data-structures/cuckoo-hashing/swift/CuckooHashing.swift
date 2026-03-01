func cuckooHashing(_ data: [Int]) -> Int {
    let n = data[0]
    if n == 0 { return 0 }

    let capacity = max(2 * n, 11)
    var table1 = [Int](repeating: -1, count: capacity)
    var table2 = [Int](repeating: -1, count: capacity)
    var inserted = Set<Int>()

    func h1(_ key: Int) -> Int { return ((key % capacity) + capacity) % capacity }
    func h2(_ key: Int) -> Int { return (((key / capacity + 1) % capacity) + capacity) % capacity }

    for i in 1...n {
        let key = data[i]
        if inserted.contains(key) { continue }

        if table1[h1(key)] == key || table2[h2(key)] == key {
            inserted.insert(key)
            continue
        }

        var current = key
        var success = false
        for _ in 0..<(2 * capacity) {
            let pos1 = h1(current)
            if table1[pos1] == -1 {
                table1[pos1] = current
                success = true
                break
            }
            let tmp1 = table1[pos1]
            table1[pos1] = current
            current = tmp1

            let pos2 = h2(current)
            if table2[pos2] == -1 {
                table2[pos2] = current
                success = true
                break
            }
            let tmp2 = table2[pos2]
            table2[pos2] = current
            current = tmp2
        }
        if success { inserted.insert(key) }
    }
    return inserted.count
}

print(cuckooHashing([3, 10, 20, 30]))
print(cuckooHashing([4, 5, 5, 5, 5]))
print(cuckooHashing([5, 1, 2, 3, 4, 5]))
