class TernarySearch {
    static func search(_ arr: [Int], _ target: Int) -> Int {
        var l = 0
        var r = arr.count - 1
        
        while r >= l {
            let mid1 = l + (r - l) / 3
            let mid2 = r - (r - l) / 3
            
            if arr[mid1] == target { return mid1 }
            if arr[mid2] == target { return mid2 }
            
            if target < arr[mid1] {
                r = mid1 - 1
            } else if target > arr[mid2] {
                l = mid2 + 1
            } else {
                l = mid1 + 1
                r = mid2 - 1
            }
        }
        return -1
    }
}
