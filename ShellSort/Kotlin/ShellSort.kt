fun IntArray.sort(): Int {
    val arr = this
    val n = arr.size


    var gap = n / 2
    while (gap > 0) {

        var i = gap
        while (i < n) {

            val temp = arr[i]


            var j: Int
            j = i
            while (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap]
                j -= gap
            }


            arr[j] = temp
            i += 1
        }
        gap /= 2
    }
    return 0
}

fun IntArray.printArray() {
    val n = this.size
    for (i in 0 until n)
        print(this[i].toString() + " ")
    println()
}


fun main(args: Array<String>) {
    println("Enter number of elements")
    val n = readLine()!!.toInt()

    val arr = IntArray(n)

    println("Enter elements")
    for (i in 0 until n)
        arr[i] = readLine()!!.toInt()



    println("Array before sorting")
    arr.printArray()

    arr.sort()

    println("Array after sorting")
    arr.printArray()
}
