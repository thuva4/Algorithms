package algorithms.sorting.cocktail

/**
 * Cocktail Sort implementation.
 * Repeatedly steps through the list in both directions, comparing adjacent elements 
 * and swapping them if they are in the wrong order.
 */
object CocktailSort {
  def sort(arr: Array[Int]): Array[Int] = {
    if (arr.length <= 1) {
      return arr.clone()
    }

    val result = arr.clone()
    val n = result.length
    var start = 0
    var end = n - 1
    var swapped = true

    while (swapped) {
      swapped = false

      // Forward pass
      for (i <- start until end) {
        if (result(i) > result(i + 1)) {
          val temp = result(i)
          result(i) = result(i + 1)
          result(i + 1) = temp
          swapped = true
        }
      }

      if (!swapped) {
        // Break using return
        return result
      }

      swapped = false
      end -= 1

      // Backward pass
      for (i <- (end - 1) to start by -1) {
        if (result(i) > result(i + 1)) {
          val temp = result(i)
          result(i) = result(i + 1)
          result(i + 1) = temp
          swapped = true
        }
      }

      start += 1
    }

    result
  }
}
