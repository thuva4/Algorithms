object Treap {
  private val rng = new scala.util.Random(42)

  private class TNode(val key: Int, val priority: Int = rng.nextInt()) {
    var left: TNode = null
    var right: TNode = null
  }

  private def rightRot(p: TNode): TNode = {
    val q = p.left
    p.left = q.right
    q.right = p
    q
  }

  private def leftRot(p: TNode): TNode = {
    val q = p.right
    p.right = q.left
    q.left = p
    q
  }

  private def insertNode(root: TNode, key: Int): TNode = {
    if (root == null) return new TNode(key)
    var node = root
    if (key < node.key) {
      node.left = insertNode(node.left, key)
      if (node.left.priority > node.priority) node = rightRot(node)
    } else if (key > node.key) {
      node.right = insertNode(node.right, key)
      if (node.right.priority > node.priority) node = leftRot(node)
    }
    node
  }

  private def inorderCollect(node: TNode, result: scala.collection.mutable.ArrayBuffer[Int]): Unit = {
    if (node == null) return
    inorderCollect(node.left, result)
    result += node.key
    inorderCollect(node.right, result)
  }

  def treap(arr: Array[Int]): Array[Int] = {
    var root: TNode = null
    for (v <- arr) root = insertNode(root, v)
    val result = scala.collection.mutable.ArrayBuffer[Int]()
    inorderCollect(root, result)
    result.toArray
  }
}
