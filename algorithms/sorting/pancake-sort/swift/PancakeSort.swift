/**
 * Pancake Sort implementation.
 * Sorts the array by repeatedly flipping subarrays.
 */
public class PancakeSort {
    public static func sort(_ arr: [Int]) -> [Int] {
        var result = arr
        let n = result.count

        if n <= 1 {
            return result
        }

        for currSize in stride(from: n, through: 2, by: -1) {
            let mi = findMax(result, currSize)

            if mi != currSize - 1 {
                flip(&result, mi)
                flip(&result, currSize - 1)
            }
        }

        return result
    }

    private static func flip(_ arr: inout [Int], _ k: Int) {
        var i = 0
        var j = k
        while i < j {
            arr.swapAt(i, j)
            i += 1
            j -= 1
        }
    }

    private static func findMax(_ arr: [Int], _ n: Int) -> Int {
        var mi = 0
        for i in 0..<n {
            if arr[i] > arr[mi] {
                mi = i
            }
        }
        return mi
    }
}
