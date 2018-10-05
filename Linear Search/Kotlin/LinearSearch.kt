// This function returns index of element x in arr[]
fun Array<Int>.search(x: Int): Int {
    for (i in indices) {
        // Return the index of the element if the element is found
        if (this[i] == x)
            return i
    }
    // return -1 if the element is not found
    return -1
}


fun main(args: Array<String>) {
    val arr = arrayOf(7, 1, 5, 1, 2)
    println("Element found at index: ${arr.search(2)}") // expected output is index 4
}