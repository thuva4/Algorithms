func kdTree(_ data: [Int]) -> Int {
    let n = data[0]
    let qx = data[1 + 2 * n], qy = data[2 + 2 * n]
    var best = Int.max
    var idx = 1
    for _ in 0..<n {
        let dx = data[idx] - qx, dy = data[idx + 1] - qy
        let d = dx * dx + dy * dy
        if d < best { best = d }
        idx += 2
    }
    return best
}

print(kdTree([3, 1, 2, 3, 4, 5, 6, 3, 3]))
print(kdTree([2, 0, 0, 5, 5, 0, 0]))
print(kdTree([1, 3, 4, 0, 0]))
