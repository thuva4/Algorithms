class ModifiedBinarySearch {
    static func search(_ arr: [Int], _ target: Int) -> Int {
        if arr.isEmpty { return -1 }
        
        var start = 0
        var end = arr.count - 1
        
        let isAscending = arr[start] <= arr[end]
        
        while start <= end {
            let mid = start + (end - start) / 2
            
            if arr[mid] == target {
                return mid
            }
            
            if isAscending {
                if target < arr[mid] {
                    end = mid - 1
                } else {
                    start = mid + 1
                }
            } else {
                if target > arr[mid] {
                    end = mid - 1
                } else {
                    start = mid + 1
                }
            }
        }
        return -1
    }
}
