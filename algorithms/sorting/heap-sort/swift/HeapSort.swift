/**
 * Heap Sort implementation.
 * Sorts an array by first building a max heap, then repeatedly extracting the maximum element.
 */
public class HeapSort {
    public static func sort(_ arr: [Int]) -> [Int] {
        var result = arr
        let n = result.count

        // Build max heap
        for i in stride(from: n / 2 - 1, through: 0, by: -1) {
            heapify(&result, n, i)
        }

        // Extract elements
        for i in stride(from: n - 1, to: 0, by: -1) {
            result.swapAt(0, i)
            heapify(&result, i, 0)
        }

        return result
    }

    private static func heapify(_ arr: inout [Int], _ n: Int, _ i: Int) {
        var largest = i
        let l = 2 * i + 1
        let r = 2 * i + 2

        if l < n && arr[l] > arr[largest] {
            largest = l
        }

        if r < n && arr[r] > arr[largest] {
            largest = r
        }

        if largest != i {
            arr.swapAt(i, largest)
            heapify(&arr, n, largest)
        }
    }
}
