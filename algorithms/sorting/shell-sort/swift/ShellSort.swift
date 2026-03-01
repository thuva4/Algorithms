class ShellSort {
    static func sort(_ arr: inout [Int]) {
        let n = arr.count
        var gap = n / 2
        
        while gap > 0 {
            for i in gap..<n {
                let temp = arr[i]
                var j = i
                while j >= gap && arr[j - gap] > temp {
                    arr[j] = arr[j - gap]
                    j -= gap
                }
                arr[j] = temp
            }
            gap /= 2
        }
    }
}
