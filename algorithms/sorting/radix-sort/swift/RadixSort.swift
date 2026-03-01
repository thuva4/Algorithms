class RadixSort {
    static func sort(_ arr: inout [Int]) {
        guard !arr.isEmpty else { return }
        
        guard let min = arr.min() else { return }
        var offset = 0
        
        if min < 0 {
            offset = abs(min)
            for i in 0..<arr.count {
                arr[i] += offset
            }
        }
        
        guard let max = arr.max() else { return }
        
        var exp = 1
        while max / exp > 0 {
            countSort(&arr, exp)
            exp *= 10
        }
        
        if (offset > 0) {
            for i in 0..<arr.count {
                arr[i] -= offset
            }
        }
    }
    
    private static func countSort(_ arr: inout [Int], _ exp: Int) {
        let n = arr.count
        var output = Array(repeating: 0, count: n)
        var count = Array(repeating: 0, count: 10)
        
        for i in 0..<n {
            count[(arr[i] / exp) % 10] += 1
        }
        
        for i in 1..<10 {
            count[i] += count[i - 1]
        }
        
        var i = n - 1
        while i >= 0 {
            let index = (arr[i] / exp) % 10
            output[count[index] - 1] = arr[i]
            count[index] -= 1
            i -= 1
        }
        
        for i in 0..<n {
            arr[i] = output[i]
        }
    }
}
