object BinarySearchTree {

  private class Node(val key: Int) {
    var left: Node = _
    var right: Node = _
  }

  private def insert(root: Node, key: Int): Node = {
    if (root == null) {
      return new Node(key)
    }
    if (key <= root.key) {
      root.left = insert(root.left, key)
    } else {
      root.right = insert(root.right, key)
    }
    root
  }

  private def inorder(root: Node, result: scala.collection.mutable.ListBuffer[Int]): Unit = {
    if (root == null) return
    inorder(root.left, result)
    result += root.key
    inorder(root.right, result)
  }

  def bstInorder(arr: Array[Int]): Array[Int] = {
    var root: Node = null
    for (key <- arr) {
      root = insert(root, key)
    }

    val result = scala.collection.mutable.ListBuffer[Int]()
    inorder(root, result)
    result.toArray
  }
}
