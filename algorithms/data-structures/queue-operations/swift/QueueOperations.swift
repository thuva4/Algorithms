func queueOps(_ arr: [Int]) -> Int {
    if arr.isEmpty { return 0 }
    var queue: [Int] = []
    var front = 0
    let opCount = arr[0]
    var idx = 1, total = 0
    for _ in 0..<opCount {
        let type = arr[idx]; let v = arr[idx + 1]; idx += 2
        if type == 1 { queue.append(v) }
        else if type == 2 && front < queue.count { total += queue[front]; front += 1 }
    }
    return total
}
