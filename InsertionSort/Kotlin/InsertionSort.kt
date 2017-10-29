import java.util.Arrays

fun Array<Int>.insertionSort() {
    val inputArray = this
    val n = inputArray.size

    for (i in 1 until n) {
        val key = inputArray[i]
        var j = i - 1

        while (j >= 0 && inputArray[j] > key) {
            inputArray[j + 1] = inputArray[j]
            j--
        }
        inputArray[j + 1] = key
    }

}

fun main(args: Array<String>) {
    val arr = arrayOf(7, 10, 5, 1, 2)
    println("Array before sorting: ${Arrays.toString(arr)}")
    arr.insertionSort()
    println("Array after sorting using insertion sort: ${Arrays.toString(arr)}")
}