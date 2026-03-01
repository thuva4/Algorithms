class FenwickTree(arr: IntArray) {
    private val tree: IntArray
    private val n: Int = arr.size

    init {
        tree = IntArray(n + 1)
        for (i in arr.indices) {
            update(i, arr[i])
        }
    }

    fun update(idx: Int, delta: Int) {
        var i = idx + 1
        while (i <= n) {
            tree[i] += delta
            i += i and (-i)
        }
    }

    fun query(idx: Int): Int {
        var sum = 0
        var i = idx + 1
        while (i > 0) {
            sum += tree[i]
            i -= i and (-i)
        }
        return sum
    }
}

fun fenwickTreeOperations(arr: IntArray, queries: Array<String>): IntArray {
    val values = arr.copyOf()
    val fenwickTree = FenwickTree(arr)
    val results = mutableListOf<Int>()

    for (query in queries) {
        val parts = query.split(" ").filter { it.isNotEmpty() }
        if (parts.isEmpty()) {
            continue
        }
        when (parts[0]) {
            "update" -> if (parts.size >= 3) {
                val index = parts[1].toInt()
                val newValue = parts[2].toInt()
                val delta = newValue - values[index]
                values[index] = newValue
                fenwickTree.update(index, delta)
            }
            "sum" -> if (parts.size >= 2) results.add(fenwickTree.query(parts[1].toInt()))
        }
    }

    return results.toIntArray()
}

fun main() {
    val arr = intArrayOf(1, 2, 3, 4, 5)
    val ft = FenwickTree(arr)
    println("Sum of first 4 elements: ${ft.query(3)}")

    ft.update(2, 5)
    println("After update, sum of first 4 elements: ${ft.query(3)}")
}
