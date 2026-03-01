class TimSort {
    private static let RUN = 32

    static func sort(_ arr: inout [Int]) {
        let n = arr.count
        if n < 2 {
            return
        }
        
        var i = 0
        while i < n {
            insertionSort(&arr, i, min((i + RUN - 1), (n - 1)))
            i += RUN
        }
        
        var size = RUN
        while size < n {
            var left = 0
            while left < n {
                let mid = left + size - 1
                let right = min((left + 2 * size - 1), (n - 1))
                
                if mid < right {
                    merge(&arr, left, mid, right)
                }
                left += 2 * size
            }
            size *= 2
        }
    }
    
    private static func insertionSort(_ arr: inout [Int], _ left: Int, _ right: Int) {
        for i in (left + 1)...right {
            let temp = arr[i]
            var j = i - 1
            while j >= left && arr[j] > temp {
                arr[j + 1] = arr[j]
                j -= 1
            }
            arr[j + 1] = temp
        }
    }
    
    private static func merge(_ arr: inout [Int], _ l: Int, _ m: Int, _ r: Int) {
        let len1 = m - l + 1
        let len2 = r - m
        var left = [Int](repeating: 0, count: len1)
        var right = [Int](repeating: 0, count: len2)
        
        for i in 0..<len1 {
            left[i] = arr[l + i]
        }
        for i in 0..<len2 {
            right[i] = arr[m + 1 + i]
        }
        
        var i = 0
        var j = 0
        var k = l
        
        while i < len1 && j < len2 {
            if left[i] <= right[j] {
                arr[k] = left[i]
                i += 1
            } else {
                arr[k] = right[j]
                j += 1
            }
            k += 1
        }
        
        while i < len1 {
            arr[k] = left[i]
            i += 1
            k += 1
        }
        
        while j < len2 {
            arr[k] = right[j]
            j += 1
            k += 1
        }
    }
}
