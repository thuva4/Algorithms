package algorithms.sorting.cocktail

/**
 * Cocktail Sort implementation.
 * Repeatedly steps through the list in both directions, comparing adjacent elements 
 * and swapping them if they are in the wrong order.
 */
object CocktailSort {
    fun sort(arr: IntArray): IntArray {
        if (arr.size <= 1) {
            return arr.copyOf()
        }

        val result = arr.copyOf()
        val n = result.size
        var start = 0
        var end = n - 1
        var swapped = true

        while (swapped) {
            swapped = false

            // Forward pass
            for (i in start until end) {
                if (result[i] > result[i + 1]) {
                    val temp = result[i]
                    result[i] = result[i + 1]
                    result[i + 1] = temp
                    swapped = true
                }
            }

            if (!swapped) {
                break
            }

            swapped = false
            end--

            // Backward pass
            for (i in end - 1 downTo start) {
                if (result[i] > result[i + 1]) {
                    val temp = result[i]
                    result[i] = result[i + 1]
                    result[i + 1] = temp
                    swapped = true
                }
            }

            start++
        }

        return result
    }
}
