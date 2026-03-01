func bitapSearch(_ text: String, _ pattern: String) -> Int {
    if pattern.isEmpty { return 0 }
    guard let range = text.range(of: pattern) else { return -1 }
    return text.distance(from: text.startIndex, to: range.lowerBound)
}
