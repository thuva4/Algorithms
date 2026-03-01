fun IntArray.binarySearch(lowerIndex: Int, upperIndex: Int, x: Int): Int {
    val arr = this
    if (upperIndex >= lowerIndex) {
        val mid = lowerIndex + (upperIndex - lowerIndex) / 2

        // If the element is found
        if (arr[mid] == x)
            return mid

        /* If the element is smaller than mid, then it can only be present in left subarray
        else the element can only be present in right subarray */
        return if (arr[mid] > x) binarySearch(lowerIndex, mid - 1, x)
        else binarySearch(mid + 1, upperIndex, x)
    }
    // We reach here only when the element is not present in array
    return -1
}

fun main(args: Array<String>) {
    println("Enter the size of array:")
    val n = readLine()!!.toInt()
    println("Enter the elements of array:")
    var arr = IntArray(n) { readLine()!!.toInt() }
    println("Enter a number to search:")
    val x = readLine()!!.toInt()
    arr = arr.sortedArray() // Sorting the array in ascending order
    println("Array in ascending order: ")
    for (l in arr)
        print("$l ")
    println()
    val result = arr.binarySearch(0, n - 1, x)
    if (result == -1)
        println("Element not present")
    else
        println("Element found at index $result")
}
