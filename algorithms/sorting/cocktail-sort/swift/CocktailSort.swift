/**
 * Cocktail Sort implementation.
 * Repeatedly steps through the list in both directions, comparing adjacent elements 
 * and swapping them if they are in the wrong order.
 */
public class CocktailSort {
    public static func sort(_ arr: [Int]) -> [Int] {
        if arr.count <= 1 {
            return arr
        }

        var result = arr
        let n = result.count
        var start = 0
        var end = n - 1
        var swapped = true

        while swapped {
            swapped = false

            // Forward pass
            for i in start..<end {
                if result[i] > result[i + 1] {
                    result.swapAt(i, i + 1)
                    swapped = true
                }
            }

            if !swapped {
                break
            }

            swapped = false
            end -= 1

            // Backward pass
            for i in stride(from: end - 1, through: start, by: -1) {
                if result[i] > result[i + 1] {
                    result.swapAt(i, i + 1)
                    swapped = true
                }
            }

            start += 1
        }

        return result
    }
}
