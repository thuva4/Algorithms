/**
 * Bogo Sort implementation.
 * Repeatedly shuffles the array until it's sorted.
 * WARNING: Highly inefficient for large arrays.
 */
public class BogoSort {
    public static func sort(_ arr: [Int]) -> [Int] {
        if arr.count <= 1 {
            return arr
        }

        var result = arr
        while !isSorted(result) {
            result.shuffle()
        }
        return result
    }

    private static func isSorted(_ arr: [Int]) -> Bool {
        for i in 0..<(arr.count - 1) {
            if arr[i] > arr[i + 1] {
                return false
            }
        }
        return true
    }
}
