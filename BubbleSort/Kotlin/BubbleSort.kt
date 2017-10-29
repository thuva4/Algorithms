import java.util.Arrays

fun <T: Comparable<T>> Array<T>.sort() {
    for (i in indices) {
        //last i elements are already sorted
        for (j in 1 until size - i) {
            if (this[j - 1] > this[j]) {
                val temp = this[j - 1] //swap
                this[j - 1] = this[j]
                this[j] = temp
            }
        }
    }
}

fun main(args: Array<String>) {
    val arr = arrayOf(2,4,1,7,3)
    println("Array before sorting: ${Arrays.toString(arr)}")
    arr.sort()
    println("Array after sorting: ${Arrays.toString(arr)}")
}