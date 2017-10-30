fun IntArray.merge(l: Int, m: Int, r: Int) {
    val arr = this
    val n1 = m - l + 1
    val n2 = r - m


    val L = IntArray(n1)
    val R = IntArray(n2)


    for (i in 0 until n1)
        L[i] = arr[l + i]
    for (j in 0 until n2)
        R[j] = arr[m + 1 + j]


    var i = 0
    var j = 0


    var k = l
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i]
            i++
        } else {
            arr[k] = R[j]
            j++
        }
        k++
    }


    while (i < n1) {
        arr[k] = L[i]
        i++
        k++
    }


    while (j < n2) {
        arr[k] = R[j]
        j++
        k++
    }
}

fun IntArray.sort(l: Int, r: Int) {
    if (l < r) {

        val m = (l + r) / 2


        sort(l, m)
        sort(m + 1, r)


        merge(l, m, r)
    }
}


fun printArray(arr: IntArray) {
    val n = arr.size
    for (i in 0 until n)
        print(arr[i].toString() + " ")
    println()
}


fun main(args: Array<String>) {

    println("Enter the number of elements :")
    val n = readLine()!!.toInt()

    val arr = IntArray(n)

    println("Enter the elements.")

    for (i in 0 until n) {
        arr[i] = readLine()!!.toInt()
    }

    println("Given Array")
    printArray(arr)


    arr.sort(0, arr.size - 1)

    println("\nSorted array")
    printArray(arr)
}
