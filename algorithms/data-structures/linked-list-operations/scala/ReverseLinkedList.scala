object ReverseLinkedList {

  private class ListNode(val value: Int, var next: ListNode = null)

  private def buildList(arr: Array[Int]): ListNode = {
    if (arr.isEmpty) return null
    val head = new ListNode(arr(0))
    var current = head
    for (i <- 1 until arr.length) {
      current.next = new ListNode(arr(i))
      current = current.next
    }
    head
  }

  private def toArray(head: ListNode): Array[Int] = {
    val result = scala.collection.mutable.ArrayBuffer[Int]()
    var current = head
    while (current != null) {
      result += current.value
      current = current.next
    }
    result.toArray
  }

  def reverseLinkedList(arr: Array[Int]): Array[Int] = {
    var head = buildList(arr)

    var prev: ListNode = null
    var current = head
    while (current != null) {
      val next = current.next
      current.next = prev
      prev = current
      current = next
    }

    toArray(prev)
  }
}
