fun longestBitonicSubsequence(arr: IntArray): Int {
    val n = arr.size
    if (n == 0) return 0

    val lis = IntArray(n) { 1 }
    val lds = IntArray(n) { 1 }

    for (i in 1 until n)
        for (j in 0 until i)
            if (arr[j] < arr[i] && lis[j] + 1 > lis[i])
                lis[i] = lis[j] + 1

    for (i in n - 2 downTo 0)
        for (j in n - 1 downTo i + 1)
            if (arr[j] < arr[i] && lds[j] + 1 > lds[i])
                lds[i] = lds[j] + 1

    return (0 until n).maxOf { lis[it] + lds[it] - 1 }
}

fun main() {
    println(longestBitonicSubsequence(intArrayOf(1, 3, 4, 2, 6, 1))) // 5
}
