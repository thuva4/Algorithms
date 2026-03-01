/**
 * Pigeonhole Sort implementation.
 * Efficient for sorting lists of integers where the number of elements is roughly the same as the number of possible key values.
 */
public class PigeonholeSort {
    public static func sort(_ arr: [Int]) -> [Int] {
        guard !arr.isEmpty else {
            return []
        }

        let minVal = arr.min()!
        let maxVal = arr.max()!
        let range = maxVal - minVal + 1

        var holes = [[Int]](repeating: [], count: range)

        for x in arr {
            holes[x - minVal].append(x)
        }

        var result = [Int]()
        result.reserveCapacity(arr.count)
        for hole in holes {
            result.append(contentsOf: hole)
        }

        return result
    }
}
