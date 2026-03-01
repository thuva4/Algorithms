private class ListNode(val value: Int, var next: ListNode? = null)

private fun buildList(arr: IntArray): ListNode? {
    if (arr.isEmpty()) return null
    val head = ListNode(arr[0])
    var current = head
    for (i in 1 until arr.size) {
        current.next = ListNode(arr[i])
        current = current.next!!
    }
    return head
}

private fun toArray(head: ListNode?): IntArray {
    val result = mutableListOf<Int>()
    var current = head
    while (current != null) {
        result.add(current.value)
        current = current.next
    }
    return result.toIntArray()
}

fun reverseLinkedList(arr: IntArray): IntArray {
    var head = buildList(arr)

    var prev: ListNode? = null
    var current = head
    while (current != null) {
        val next = current.next
        current.next = prev
        prev = current
        current = next
    }

    return toArray(prev)
}
