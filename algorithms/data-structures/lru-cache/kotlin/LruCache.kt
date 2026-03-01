private class LruNode(var key: Int, var value: Int) {
    var prev: LruNode? = null
    var next: LruNode? = null
}

private class LruCacheImpl(private val capacity: Int) {
    private val map = HashMap<Int, LruNode>()
    private val head = LruNode(0, 0)
    private val tail = LruNode(0, 0)

    init {
        head.next = tail
        tail.prev = head
    }

    private fun removeNode(node: LruNode) {
        node.prev!!.next = node.next
        node.next!!.prev = node.prev
    }

    private fun addToHead(node: LruNode) {
        node.next = head.next
        node.prev = head
        head.next!!.prev = node
        head.next = node
    }

    fun get(key: Int): Int {
        val node = map[key] ?: return -1
        removeNode(node)
        addToHead(node)
        return node.value
    }

    fun put(key: Int, value: Int) {
        val existing = map[key]
        if (existing != null) {
            existing.value = value
            removeNode(existing)
            addToHead(existing)
        } else {
            if (map.size == capacity) {
                val lru = tail.prev!!
                removeNode(lru)
                map.remove(lru.key)
            }
            val node = LruNode(key, value)
            map[key] = node
            addToHead(node)
        }
    }
}

fun lruCache(operations: IntArray): Int {
    val capacity = operations[0]
    val opCount = operations[1]
    val cache = LruCacheImpl(capacity)
    var resultSum = 0
    var idx = 2

    for (i in 0 until opCount) {
        val opType = operations[idx]
        val key = operations[idx + 1]
        val value = operations[idx + 2]
        idx += 3

        if (opType == 1) {
            cache.put(key, value)
        } else if (opType == 2) {
            resultSum += cache.get(key)
        }
    }

    return resultSum
}
