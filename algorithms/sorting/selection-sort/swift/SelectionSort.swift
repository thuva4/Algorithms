class SelectionSort {
    static func sort(_ arr: inout [Int]) {
        let n = arr.count
        guard n > 1 else { return }
        
        for i in 0..<n-1 {
            var min_idx = i
            for j in i+1..<n {
                if arr[j] < arr[min_idx] {
                    min_idx = j
                }
            }
            if i != min_idx {
                arr.swapAt(i, min_idx)
            }
        }
    }
}
