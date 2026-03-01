fun ropeDataStructure(data: IntArray): Int {
    val n1 = data[0]
    val arr1 = data.sliceArray(1 until 1 + n1)
    val pos = 1 + n1
    val n2 = data[pos]
    val arr2 = data.sliceArray(pos + 1 until pos + 1 + n2)
    val queryIndex = data[pos + 1 + n2]

    return if (queryIndex < n1) arr1[queryIndex] else arr2[queryIndex - n1]
}

fun main() {
    println(ropeDataStructure(intArrayOf(3, 1, 2, 3, 2, 4, 5, 0)))
    println(ropeDataStructure(intArrayOf(3, 1, 2, 3, 2, 4, 5, 4)))
    println(ropeDataStructure(intArrayOf(3, 1, 2, 3, 2, 4, 5, 3)))
}
