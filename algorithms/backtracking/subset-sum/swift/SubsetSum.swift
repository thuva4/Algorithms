func subsetSum(_ arr: [Int], _ target: Int) -> Int {
    func backtrack(_ index: Int, _ remaining: Int) -> Bool {
        if remaining == 0 {
            return true
        }
        if index >= arr.count {
            return false
        }
        // Include arr[index]
        if backtrack(index + 1, remaining - arr[index]) {
            return true
        }
        // Exclude arr[index]
        if backtrack(index + 1, remaining) {
            return true
        }
        return false
    }

    return backtrack(0, target) ? 1 : 0
}
