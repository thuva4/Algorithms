/**
 * Insertion Sort implementation.
 * Builds the final sorted array (or list) one item at a time.
 */
public class InsertionSort {
    public static func sort(_ arr: [Int]) -> [Int] {
        var result = arr
        let n = result.count
        if n < 2 {
            return result
        }

        for i in 1..<n {
            let key = result[i]
            var j = i - 1

            while j >= 0 && result[j] > key {
                result[j + 1] = result[j]
                j = j - 1
            }
            result[j + 1] = key
        }

        return result
    }
}
