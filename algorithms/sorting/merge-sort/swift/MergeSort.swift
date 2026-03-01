/**
 * Merge Sort implementation.
 * Sorts an array by recursively dividing it into halves, sorting each half,
 * and then merging the sorted halves.
 */
public class MergeSort {
    public static func sort(_ arr: [Int]) -> [Int] {
        if arr.count <= 1 {
            return arr
        }

        let mid = arr.count / 2
        let left = sort(Array(arr[0..<mid]))
        let right = sort(Array(arr[mid..<arr.count]))

        return merge(left, right)
    }

    private static func merge(_ left: [Int], _ right: [Int]) -> [Int] {
        var result = [Int]()
        result.reserveCapacity(left.count + right.count)
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

        result.append(contentsOf: left[i...])
        result.append(contentsOf: right[j...])

        return result
    }
}
