class InterpolationSearch {
    static func search(_ arr: [Int], _ target: Int) -> Int {
        if arr.isEmpty { return -1 }
        
        var lo = 0
        var hi = arr.count - 1
        
        while lo <= hi && target >= arr[lo] && target <= arr[hi] {
            if lo == hi {
                if arr[lo] == target { return lo }
                return -1
            }
            
            if arr[hi] == arr[lo] {
                if arr[lo] == target { return lo }
                return -1
            }
            
            let pos = lo + Int((Double(hi - lo) / Double(arr[hi] - arr[lo])) * Double(target - arr[lo]))
            
            if arr[pos] == target { return pos }
            
            if arr[pos] < target {
                lo = pos + 1
            } else {
                hi = pos - 1
            }
        }
        return -1
    }
}
