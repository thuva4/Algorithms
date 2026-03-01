private class HashTableImpl(private val size: Int = 64) {
    private data class Entry(val key: Int, var value: Int)

    private val buckets = Array(size) { mutableListOf<Entry>() }

    private fun hash(key: Int): Int = Math.abs(key) % size

    fun put(key: Int, value: Int) {
        val idx = hash(key)
        for (entry in buckets[idx]) {
            if (entry.key == key) {
                entry.value = value
                return
            }
        }
        buckets[idx].add(Entry(key, value))
    }

    fun get(key: Int): Int {
        val idx = hash(key)
        for (entry in buckets[idx]) {
            if (entry.key == key) {
                return entry.value
            }
        }
        return -1
    }

    fun delete(key: Int) {
        val idx = hash(key)
        buckets[idx].removeAll { it.key == key }
    }
}

fun hashTableOps(operations: IntArray): Int {
    val table = HashTableImpl()
    val opCount = operations[0]
    var resultSum = 0
    var idx = 1

    for (i in 0 until opCount) {
        val opType = operations[idx]
        val key = operations[idx + 1]
        val value = operations[idx + 2]
        idx += 3

        when (opType) {
            1 -> table.put(key, value)
            2 -> resultSum += table.get(key)
            3 -> table.delete(key)
        }
    }

    return resultSum
}
