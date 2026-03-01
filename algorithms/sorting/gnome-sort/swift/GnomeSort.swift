/**
 * Gnome Sort implementation.
 * A sorting algorithm which is similar to insertion sort in that it works with one item at a time
 * but gets the item to the proper place by a series of swaps, similar to a bubble sort.
 */
public class GnomeSort {
    public static func sort(_ arr: [Int]) -> [Int] {
        var result = arr
        let n = result.count
        if n < 2 {
            return result
        }
        var index = 0

        while index < n {
            if index == 0 {
                index += 1
            }
            if result[index] >= result[index - 1] {
                index += 1
            } else {
                result.swapAt(index, index - 1)
                index -= 1
            }
        }

        return result
    }
}
