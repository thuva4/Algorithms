fun printArray(x: IntArray) {
    for (i in x.indices)
        print(x[i].toString() + " ")
}


fun IntArray.sort(low: Int = 0, high: Int = this.size - 1) {
    if (low >= high) return

    val middle = partition(low, high)
    sort(low, middle - 1)
    sort(middle + 1, high)
}

fun IntArray.partition(low: Int, high: Int): Int {
    val middle = low + (high - low) / 2
    val a = this
    swap(a, middle, high)
    
    var storeIndex = low
    for (i in low until high) {
        if (a[i] < a[high]) {
            swap(a, storeIndex, i)
            storeIndex++
        }
    }
    swap(a, high, storeIndex)
    return storeIndex
}

fun swap(a: IntArray, i: Int, j: Int) {
    val temp = a[i]
    a[i] = a[j]
    a[j] = temp
}

fun main(args: Array<String>) {
    println("Enter the number of elements :")
    val n = readLine()!!.toInt()

    val arr = IntArray(n)

    println("Enter the elements.")

    for (i in 0 until n) {
        arr[i] = readLine()!!.toInt()
    }

    println("Given array")
    printArray(arr)

    arr.sort()

    println("\nSorted array")
    printArray(arr)

}
