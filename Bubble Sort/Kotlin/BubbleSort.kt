fun <T : Comparable<T>> sort(a: Array<T>) {
    for (i in a.indices) {
        for (j in 1 until a.size - i) {
            if (a[j - 1].compareTo(a[j]) > 0) {
                val temp = a[j - 1]
                a[j - 1] = a[j]
                a[j] = temp
            }
        }
    }
}

fun sortSimple(a: IntArray) {
    for (i in a.indices) {
        var sorted = true
        for (j in 1 until a.size - i) {
            if (a[j] < a[j - 1]) {
                val temp = a[j - 1]
                a[j - 1] = a[j]
                a[j] = temp
                sorted = false
            }
        }
        if (sorted) break
    }
}