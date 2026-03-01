import scala.collection.mutable

object LruCache {

  private class Node(var key: Int, var value: Int) {
    var prev: Node = _
    var next: Node = _
  }

  private class LruCacheImpl(capacity: Int) {
    private val map = mutable.HashMap[Int, Node]()
    private val head = new Node(0, 0)
    private val tail = new Node(0, 0)
    head.next = tail
    tail.prev = head

    private def removeNode(node: Node): Unit = {
      node.prev.next = node.next
      node.next.prev = node.prev
    }

    private def addToHead(node: Node): Unit = {
      node.next = head.next
      node.prev = head
      head.next.prev = node
      head.next = node
    }

    def get(key: Int): Int = {
      map.get(key) match {
        case Some(node) =>
          removeNode(node)
          addToHead(node)
          node.value
        case None => -1
      }
    }

    def put(key: Int, value: Int): Unit = {
      map.get(key) match {
        case Some(node) =>
          node.value = value
          removeNode(node)
          addToHead(node)
        case None =>
          if (map.size == capacity) {
            val lru = tail.prev
            removeNode(lru)
            map.remove(lru.key)
          }
          val node = new Node(key, value)
          map(key) = node
          addToHead(node)
      }
    }
  }

  def lruCache(operations: Array[Int]): Int = {
    val capacity = operations(0)
    val opCount = operations(1)
    val cache = new LruCacheImpl(capacity)
    var resultSum = 0
    var idx = 2

    for (_ <- 0 until opCount) {
      val opType = operations(idx)
      val key = operations(idx + 1)
      val value = operations(idx + 2)
      idx += 3

      if (opType == 1) {
        cache.put(key, value)
      } else if (opType == 2) {
        resultSum += cache.get(key)
      }
    }

    resultSum
  }
}
