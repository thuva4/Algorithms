fun cuckooHashing(data: IntArray): Int {
    val n = data[0]
    if (n == 0) return 0

    val capacity = maxOf(2 * n, 11)
    val table1 = IntArray(capacity) { -1 }
    val table2 = IntArray(capacity) { -1 }
    val inserted = mutableSetOf<Int>()

    fun h1(key: Int) = ((key % capacity) + capacity) % capacity
    fun h2(key: Int) = (((key / capacity + 1) % capacity) + capacity) % capacity

    for (i in 1..n) {
        val key = data[i]
        if (key in inserted) continue

        if (table1[h1(key)] == key || table2[h2(key)] == key) {
            inserted.add(key)
            continue
        }

        var current = key
        var success = false
        for (iter in 0 until 2 * capacity) {
            val pos1 = h1(current)
            if (table1[pos1] == -1) {
                table1[pos1] = current
                success = true
                break
            }
            val tmp1 = table1[pos1]
            table1[pos1] = current
            current = tmp1

            val pos2 = h2(current)
            if (table2[pos2] == -1) {
                table2[pos2] = current
                success = true
                break
            }
            val tmp2 = table2[pos2]
            table2[pos2] = current
            current = tmp2
        }
        if (success) inserted.add(key)
    }
    return inserted.size
}

fun main() {
    println(cuckooHashing(intArrayOf(3, 10, 20, 30)))
    println(cuckooHashing(intArrayOf(4, 5, 5, 5, 5)))
    println(cuckooHashing(intArrayOf(5, 1, 2, 3, 4, 5)))
}
