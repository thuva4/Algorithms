class ExponentialSearch {
    static func search(_ arr: [Int], _ target: Int) -> Int {
        if arr.isEmpty { return -1 }
        if arr[0] == target { return 0 }
        
        let n = arr.count
        var i = 1
        while i < n && arr[i] <= target {
            i *= 2
        }
        
        return binarySearch(arr, i / 2, min(i, n) - 1, target)
    }
    
    private static func binarySearch(_ arr: [Int], _ l: Int, _ r: Int, _ target: Int) -> Int {
        var left = l
        var right = r
        while left <= right {
            let mid = left + (right - left) / 2
            if arr[mid] == target { return mid }
            if arr[mid] < target { left = mid + 1 }
            else { right = mid - 1 }
        }
        return -1
    }
}
