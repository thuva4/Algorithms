/**
 * Bitonic Sort implementation.
 * Works on any array size by padding to the nearest power of 2.
 */
public class BitonicSort {
    public static func sort(_ arr: [Int]) -> [Int] {
        if arr.isEmpty {
            return []
        }

        let n = arr.count
        var nextPow2 = 1
        while nextPow2 < n {
            nextPow2 *= 2
        }

        // Pad the array to the next power of 2
        // We use Int.max for padding to handle ascending sort
        var padded = Array(repeating: Int.max, count: nextPow2)
        for i in 0..<n {
            padded[i] = arr[i]
        }

        bitonicSortRecursive(&padded, 0, nextPow2, true)

        // Return the first n elements (trimmed back to original size)
        return Array(padded[0..<n])
    }

    private static func compareAndSwap(_ arr: inout [Int], _ i: Int, _ j: Int, _ ascending: Bool) {
        if (ascending && arr[i] > arr[j]) || (!ascending && arr[i] < arr[j]) {
            arr.swapAt(i, j)
        }
    }

    private static func bitonicMerge(_ arr: inout [Int], _ low: Int, _ cnt: Int, _ ascending: Bool) {
        if cnt > 1 {
            let k = cnt / 2
            for i in low..<(low + k) {
                compareAndSwap(&arr, i, i + k, ascending)
            }
            bitonicMerge(&arr, low, k, ascending)
            bitonicMerge(&arr, low + k, k, ascending)
        }
    }

    private static func bitonicSortRecursive(_ arr: inout [Int], _ low: Int, _ cnt: Int, _ ascending: Bool) {
        if cnt > 1 {
            let k = cnt / 2
            // Sort first half in ascending order
            bitonicSortRecursive(&arr, low, k, true)
            // Sort second half in descending order
            bitonicSortRecursive(&arr, low + k, k, false)
            // Merge the whole sequence in given order
            bitonicMerge(&arr, low, cnt, ascending)
        }
    }
}
