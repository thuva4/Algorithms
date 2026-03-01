class BinarySearch {
    static func search(_ arr: [Int], _ target: Int) -> Int {
        var left = 0
        var right = arr.count - 1
        
        while left <= right {
            let mid = left + (right - left) / 2
            
            if arr[mid] == target {
                return mid
            }
            
            if arr[mid] < target {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }
        
        return -1
    }
}
