func stackOps(_ arr: [Int]) -> Int {
    if arr.isEmpty { return 0 }
    var stack: [Int] = []
    let opCount = arr[0]
    var idx = 1, total = 0
    for _ in 0..<opCount {
        let type = arr[idx]; let v = arr[idx + 1]; idx += 2
        if type == 1 { stack.append(v) }
        else if type == 2 { total += stack.isEmpty ? -1 : stack.removeLast() }
    }
    return total
}
