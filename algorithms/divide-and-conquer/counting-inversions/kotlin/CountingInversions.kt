fun countInversions(arr: IntArray): Int {
    val temp = IntArray(arr.size)
    return mergeSortCount(arr, temp, 0, arr.size - 1)
}

fun mergeSortCount(arr: IntArray, temp: IntArray, left: Int, right: Int): Int {
    var invCount = 0
    if (left < right) {
        val mid = (left + right) / 2
        invCount += mergeSortCount(arr, temp, left, mid)
        invCount += mergeSortCount(arr, temp, mid + 1, right)
        invCount += merge(arr, temp, left, mid + 1, right)
    }
    return invCount
}

fun merge(arr: IntArray, temp: IntArray, left: Int, mid: Int, right: Int): Int {
    var i = left
    var j = mid
    var k = left
    var invCount = 0

    while (i < mid && j <= right) {
        if (arr[i] <= arr[j]) {
            temp[k++] = arr[i++]
        } else {
            temp[k++] = arr[j++]
            invCount += (mid - i)
        }
    }
    while (i < mid) temp[k++] = arr[i++]
    while (j <= right) temp[k++] = arr[j++]
    for (idx in left..right) arr[idx] = temp[idx]

    return invCount
}

fun main() {
    val arr = intArrayOf(2, 4, 1, 3, 5)
    println("Number of inversions: ${countInversions(arr)}")
}
