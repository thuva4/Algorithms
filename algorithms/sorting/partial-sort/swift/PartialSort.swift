/**
 * Partial Sort implementation.
 * Returns the smallest k elements of the array in sorted order.
 */
public class PartialSort {
    public static func sort(_ arr: [Int], _ k: Int) -> [Int] {
        if k <= 0 {
            return []
        }
        let sortedArr = arr.sorted()
        if k >= arr.count {
            return sortedArr
        }
        return Array(sortedArr.prefix(k))
    }
}

func partialSort(_ arr: [Int]) -> [Int] {
    PartialSort.sort(arr, arr.count)
}
