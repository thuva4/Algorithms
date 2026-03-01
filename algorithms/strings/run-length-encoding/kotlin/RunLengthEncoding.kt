fun runLengthEncoding(arr: IntArray): IntArray {
    if (arr.isEmpty()) return intArrayOf()
    val result = mutableListOf<Int>()
    var count = 1
    for (i in 1 until arr.size) {
        if (arr[i] == arr[i-1]) count++
        else { result.add(arr[i-1]); result.add(count); count = 1 }
    }
    result.add(arr.last()); result.add(count)
    return result.toIntArray()
}
