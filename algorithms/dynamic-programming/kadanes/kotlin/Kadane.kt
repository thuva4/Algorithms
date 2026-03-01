fun kadane(arr: IntArray): Int {
    var maxSoFar = arr[0]
    var maxEndingHere = arr[0]

    for (i in 1 until arr.size) {
        maxEndingHere = maxOf(arr[i], maxEndingHere + arr[i])
        maxSoFar = maxOf(maxSoFar, maxEndingHere)
    }

    return maxSoFar
}

fun main() {
    println(kadane(intArrayOf(-2, 1, -3, 4, -1, 2, 1, -5, 4))) // 6
}
