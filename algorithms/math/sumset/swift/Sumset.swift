func sumset(_ setA: [Int], _ setB: [Int]) -> [Int] {
    var result: [Int] = []
    for a in setA {
        for b in setB {
            result.append(a + b)
        }
    }
    return result.sorted()
}
