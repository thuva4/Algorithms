func pointInPolygon(_ arr: [Int]) -> Int {
    let px = Double(arr[0])
    let py = Double(arr[1])
    let n = arr[2]

    var inside = false
    var j = n - 1
    for i in 0..<n {
        let xi = Double(arr[3 + 2 * i])
        let yi = Double(arr[3 + 2 * i + 1])
        let xj = Double(arr[3 + 2 * j])
        let yj = Double(arr[3 + 2 * j + 1])

        if (yi > py) != (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi {
            inside = !inside
        }
        j = i
    }

    return inside ? 1 : 0
}
