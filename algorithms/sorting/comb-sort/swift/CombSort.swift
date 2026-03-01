import Foundation

/**
 * Comb Sort implementation.
 * Improves on Bubble Sort by using a gap larger than 1.
 * The gap starts with a large value and shrinks by a factor of 1.3 in every iteration until it reaches 1.
 */
public class CombSort {
    public static func sort(_ arr: [Int]) -> [Int] {
        var result = arr
        let n = result.count
        if n < 2 {
            return result
        }
        var gap = n
        let shrink = 1.3
        var sorted = false

        while !sorted {
            gap = Int(floor(Double(gap) / shrink))
            if gap <= 1 {
                gap = 1
                sorted = true
            }

            for i in 0..<(n - gap) {
                if result[i] > result[i + gap] {
                    result.swapAt(i, i + gap)
                    sorted = false
                }
            }
        }

        return result
    }
}
