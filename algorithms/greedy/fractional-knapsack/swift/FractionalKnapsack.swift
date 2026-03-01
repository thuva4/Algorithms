func fractionalKnapsack(_ arr: [Int]) -> Int {
    let capacity = arr[0]; let n = arr[1]
    var items: [(Int, Int)] = []
    var idx = 2
    for _ in 0..<n { items.append((arr[idx], arr[idx + 1])); idx += 2 }
    items.sort { Double($0.0) / Double($0.1) > Double($1.0) / Double($1.1) }

    var totalValue = 0.0; var remaining = capacity
    for (value, weight) in items {
        if remaining <= 0 { break }
        if weight <= remaining { totalValue += Double(value); remaining -= weight }
        else { totalValue += Double(value) * Double(remaining) / Double(weight); remaining = 0 }
    }
    return Int(totalValue * 100)
}
