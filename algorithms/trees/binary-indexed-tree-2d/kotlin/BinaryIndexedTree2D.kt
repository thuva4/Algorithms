class BIT2DDS(val rows: Int, val cols: Int) {
    val tree = Array(rows + 1) { LongArray(cols + 1) }

    fun update(r: Int, c: Int, v: Long) {
        var i = r + 1
        while (i <= rows) {
            var j = c + 1
            while (j <= cols) { tree[i][j] += v; j += j and (-j) }
            i += i and (-i)
        }
    }

    fun query(r: Int, c: Int): Long {
        var s = 0L; var i = r + 1
        while (i > 0) {
            var j = c + 1
            while (j > 0) { s += tree[i][j]; j -= j and (-j) }
            i -= i and (-i)
        }
        return s
    }
}

fun binaryIndexedTree2d(rows: Int, cols: Int, matrix: Array<IntArray>, operations: Array<IntArray>): LongArray {
    val bit = BIT2DDS(rows, cols)
    for (r in 0 until minOf(rows, matrix.size)) {
        for (c in 0 until minOf(cols, matrix[r].size)) {
            val value = matrix[r][c]
            if (value != 0) {
                bit.update(r, c, value.toLong())
            }
        }
    }

    val results = mutableListOf<Long>()
    for (operation in operations) {
        if (operation.size < 4) {
            continue
        }
        if (operation[0] == 1) {
            bit.update(operation[1], operation[2], operation[3].toLong())
        } else {
            results.add(bit.query(operation[1], operation[2]))
        }
    }
    return results.toLongArray()
}

fun main() {
    val input = System.`in`.bufferedReader().readText().trim().split("\\s+".toRegex()).map { it.toInt() }
    var idx = 0
    val rows = input[idx++]; val cols = input[idx++]
    val bit = BIT2DDS(rows, cols)
    for (r in 0 until rows) for (c in 0 until cols) { val v = input[idx++]; if (v != 0) bit.update(r, c, v.toLong()) }
    val q = input[idx++]
    val results = mutableListOf<Long>()
    for (i in 0 until q) {
        val t = input[idx++]; val r = input[idx++]; val c = input[idx++]; val v = input[idx++]
        if (t == 1) bit.update(r, c, v.toLong()) else results.add(bit.query(r, c))
    }
    println(results.joinToString(" "))
}
