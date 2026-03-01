import kotlin.random.Random

private const val MAX_LEVEL = 16

private class SkipNode(val key: Int, level: Int) {
    val forward = arrayOfNulls<SkipNode>(level + 1)
}

fun skipList(arr: IntArray): IntArray {
    val header = SkipNode(Int.MIN_VALUE, MAX_LEVEL)
    var level = 0

    for (v in arr) {
        val update = arrayOfNulls<SkipNode>(MAX_LEVEL + 1)
        var current = header
        for (i in level downTo 0) {
            while (current.forward[i] != null && current.forward[i]!!.key < v)
                current = current.forward[i]!!
            update[i] = current
        }
        val next = current.forward[0]
        if (next != null && next.key == v) continue

        var newLevel = 0
        while (Random.nextBoolean() && newLevel < MAX_LEVEL) newLevel++
        if (newLevel > level) {
            for (i in level + 1..newLevel) update[i] = header
            level = newLevel
        }
        val newNode = SkipNode(v, newLevel)
        for (i in 0..newLevel) {
            newNode.forward[i] = update[i]!!.forward[i]
            update[i]!!.forward[i] = newNode
        }
    }

    val result = mutableListOf<Int>()
    var node = header.forward[0]
    while (node != null) {
        result.add(node.key)
        node = node.forward[0]
    }
    return result.toIntArray()
}
