class StrandSort {
    static func sort(_ arr: inout [Int]) {
        if arr.count <= 1 { return }
        
        var list = arr
        var sorted: [Int] = []
        
        while !list.isEmpty {
            var strand: [Int] = []
            strand.append(list.removeFirst())
            
            var i = 0
            while i < list.count {
                if list[i] >= strand.last! {
                    strand.append(list.remove(at: i))
                } else {
                    i += 1
                }
            }
            
            sorted = merge(sorted, strand)
        }
        
        arr = sorted
    }
    
    private static func merge(_ left: [Int], _ right: [Int]) -> [Int] {
        var result: [Int] = []
        var i = 0
        var j = 0
        
        while i < left.count && j < right.count {
            if left[i] <= right[j] {
                result.append(left[i])
                i += 1
            } else {
                result.append(right[j])
                j += 1
            }
        }
        
        while i < left.count {
            result.append(left[i])
            i += 1
        }
        
        while j < right.count {
            result.append(right[j])
            j += 1
        }
        
        return result
    }
}
