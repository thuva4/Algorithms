import Foundation

class JumpSearch {
    static func search(_ arr: [Int], _ target: Int) -> Int {
        let n = arr.count
        if n == 0 { return -1 }
        
        var step = Int(sqrt(Double(n)))
        var prev = 0
        
        while arr[min(step, n) - 1] < target {
            prev = step
            step += Int(sqrt(Double(n)))
            if prev >= n { return -1 }
        }
        
        while arr[prev] < target {
            prev += 1
            if prev == min(step, n) { return -1 }
        }
        
        if arr[prev] == target { return prev }
        
        return -1
    }
}
