object BTree {
  private val T = 3
  private val MaxKeys = 2 * T - 1

  private class Node(var leaf: Boolean = true) {
    val keys = scala.collection.mutable.ArrayBuffer[Int]()
    val children = scala.collection.mutable.ArrayBuffer[Node]()
  }

  private def splitChild(parent: Node, i: Int): Unit = {
    val full = parent.children(i)
    val newNode = new Node(full.leaf)
    val mid = T - 1
    for (j <- T until full.keys.size) newNode.keys += full.keys(j)
    val median = full.keys(mid)
    if (!full.leaf) {
      for (j <- T until full.children.size) newNode.children += full.children(j)
      full.children.trimEnd(full.children.size - T)
    }
    full.keys.trimEnd(full.keys.size - mid)
    parent.keys.insert(i, median)
    parent.children.insert(i + 1, newNode)
  }

  private def insertNonFull(node: Node, key: Int): Unit = {
    if (node.leaf) {
      val pos = node.keys.indexWhere(_ > key) match {
        case -1 => node.keys.size
        case p  => p
      }
      node.keys.insert(pos, key)
    } else {
      var i = node.keys.size - 1
      while (i >= 0 && key < node.keys(i)) i -= 1
      i += 1
      if (node.children(i).keys.size == MaxKeys) {
        splitChild(node, i)
        if (key > node.keys(i)) i += 1
      }
      insertNonFull(node.children(i), key)
    }
  }

  private def inorder(node: Node, result: scala.collection.mutable.ArrayBuffer[Int]): Unit = {
    if (node == null) return
    for (i <- 0 until node.keys.size) {
      if (!node.leaf) inorder(node.children(i), result)
      result += node.keys(i)
    }
    if (!node.leaf) inorder(node.children(node.keys.size), result)
  }

  def bTree(arr: Array[Int]): Array[Int] = {
    if (arr.isEmpty) return Array.empty[Int]
    var root = new Node(true)
    for (v <- arr) {
      if (root.keys.size == MaxKeys) {
        val newRoot = new Node(false)
        newRoot.children += root
        splitChild(newRoot, 0)
        root = newRoot
      }
      insertNonFull(root, v)
    }
    val result = scala.collection.mutable.ArrayBuffer[Int]()
    inorder(root, result)
    result.toArray
  }
}
