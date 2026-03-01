class LinearSearch {
    static func search(_ arr: [Int], _ target: Int) -> Int {
        for (index, value) in arr.enumerated() {
            if value == target {
                return index
            }
        }
        return -1
    }
}
