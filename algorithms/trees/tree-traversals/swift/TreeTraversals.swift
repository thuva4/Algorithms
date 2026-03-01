private func inorderHelper(_ arr: [Int], _ i: Int, _ result: inout [Int]) {
    if i >= arr.count || arr[i] == -1 { return }
    inorderHelper(arr, 2 * i + 1, &result)
    result.append(arr[i])
    inorderHelper(arr, 2 * i + 2, &result)
}

func treeTraversals(_ arr: [Int]) -> [Int] {
    var result: [Int] = []
    inorderHelper(arr, 0, &result)
    return result
}
