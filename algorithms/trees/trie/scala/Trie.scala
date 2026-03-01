import scala.collection.mutable

object Trie {

  private class TrieNode {
    val children: mutable.Map[Char, TrieNode] = mutable.Map()
    var isEnd: Boolean = false
  }

  private def insert(root: TrieNode, key: Int): Unit = {
    var node = root
    for (ch <- key.toString) {
      if (!node.children.contains(ch)) {
        node.children(ch) = new TrieNode()
      }
      node = node.children(ch)
    }
    node.isEnd = true
  }

  private def search(root: TrieNode, key: Int): Boolean = {
    var node = root
    for (ch <- key.toString) {
      node.children.get(ch) match {
        case Some(child) => node = child
        case None => return false
      }
    }
    node.isEnd
  }

  def trieInsertSearch(arr: Array[Int]): Int = {
    val n = arr.length
    val mid = n / 2
    val root = new TrieNode()

    for (i <- 0 until mid) {
      insert(root, arr(i))
    }

    var count = 0
    for (i <- mid until n) {
      if (search(root, arr(i))) {
        count += 1
      }
    }

    count
  }
}
