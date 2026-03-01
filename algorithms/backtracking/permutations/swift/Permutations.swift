func permutations(_ arr: [Int]) -> [[Int]] {
    var result = [[Int]]()
    if arr.isEmpty {
        result.append([])
        return result
    }

    func backtrack(_ current: inout [Int], _ remaining: inout [Int]) {
        if remaining.isEmpty {
            result.append(current)
            return
        }
        for i in 0..<remaining.count {
            let elem = remaining.remove(at: i)
            current.append(elem)
            backtrack(&current, &remaining)
            current.removeLast()
            remaining.insert(elem, at: i)
        }
    }

    var current = [Int]()
    var rem = arr
    backtrack(&current, &rem)
    result.sort { a, b in
        for i in 0..<a.count {
            if a[i] != b[i] { return a[i] < b[i] }
        }
        return false
    }
    return result
}

let result = permutations([1, 2, 3])
for perm in result {
    print(perm)
}
