/**
 * Bubble Sort implementation.
 * Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.
 * Includes the 'swapped' flag optimization to terminate early if the array is already sorted.
 */
public class BubbleSort {
    public static func sort(_ arr: [Int]) -> [Int] {
        if arr.count <= 1 {
            return arr
        }

        // Create a copy of the input array to avoid modifying it
        var result = arr
        let n = result.count

        for i in 0..<(n - 1) {
            // Optimization: track if any swaps occurred in this pass
            var swapped = false

            // Last i elements are already in place, so we don't need to check them
            for j in 0..<(n - i - 1) {
                if result[j] > result[j + 1] {
                    // Swap elements if they are in the wrong order
                    result.swapAt(j, j + 1)
                    swapped = true
                }
            }

            // If no two elements were swapped by inner loop, then break
            if !swapped {
                break
            }
        }

        return result
    }
}
