func runLengthEncoding(_ arr: [Int]) -> [Int] {
    if arr.isEmpty { return [] }
    var result: [Int] = []
    var count = 1
    for i in 1..<arr.count {
        if arr[i] == arr[i-1] { count += 1 }
        else { result.append(contentsOf: [arr[i-1], count]); count = 1 }
    }
    result.append(contentsOf: [arr.last!, count])
    return result
}
