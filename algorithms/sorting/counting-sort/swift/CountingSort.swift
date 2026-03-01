/**
 * Counting Sort implementation.
 * Efficient for sorting integers with a known small range.
 */
public class CountingSort {
    public static func sort(_ arr: [Int]) -> [Int] {
        guard !arr.isEmpty else {
            return []
        }

        let minVal = arr.min()!
        let maxVal = arr.max()!
        let range = maxVal - minVal + 1

        var count = [Int](repeating: 0, count: range)
        var output = [Int](repeating: 0, count: arr.count)

        for x in arr {
            count[x - minVal] += 1
        }

        for i in 1..<range {
            count[i] += count[i - 1]
        }

        for x in arr.reversed() {
            output[count[x - minVal] - 1] = x
            count[x - minVal] -= 1
        }

        return output
    }
}
