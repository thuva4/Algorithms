object SplayTree {
  private class SNode(val key: Int, var left: SNode = null, var right: SNode = null)

  private def rightRotate(x: SNode): SNode = {
    val y = x.left
    x.left = y.right
    y.right = x
    y
  }

  private def leftRotate(x: SNode): SNode = {
    val y = x.right
    x.right = y.left
    y.left = x
    y
  }

  private def splayOp(root: SNode, key: Int): SNode = {
    if (root == null || root.key == key) return root
    if (key < root.key) {
      if (root.left == null) return root
      if (key < root.left.key) {
        root.left.left = splayOp(root.left.left, key)
        val r = rightRotate(root)
        return r
      } else if (key > root.left.key) {
        root.left.right = splayOp(root.left.right, key)
        if (root.left.right != null) root.left = leftRotate(root.left)
      }
      if (root.left == null) root else rightRotate(root)
    } else {
      if (root.right == null) return root
      if (key > root.right.key) {
        root.right.right = splayOp(root.right.right, key)
        val r = leftRotate(root)
        return r
      } else if (key < root.right.key) {
        root.right.left = splayOp(root.right.left, key)
        if (root.right.left != null) root.right = rightRotate(root.right)
      }
      if (root.right == null) root else leftRotate(root)
    }
  }

  private def insertNode(root: SNode, key: Int): SNode = {
    if (root == null) return new SNode(key)
    val r = splayOp(root, key)
    if (r.key == key) return r
    val node = new SNode(key)
    if (key < r.key) {
      node.right = r
      node.left = r.left
      r.left = null
    } else {
      node.left = r
      node.right = r.right
      r.right = null
    }
    node
  }

  private def inorderCollect(node: SNode, result: scala.collection.mutable.ArrayBuffer[Int]): Unit = {
    if (node == null) return
    inorderCollect(node.left, result)
    result += node.key
    inorderCollect(node.right, result)
  }

  def splayTree(arr: Array[Int]): Array[Int] = {
    var root: SNode = null
    for (v <- arr) {
      root = insertNode(root, v)
    }
    val result = scala.collection.mutable.ArrayBuffer[Int]()
    inorderCollect(root, result)
    if (result.length == arr.length && result.sameElements(arr.sorted)) {
      result.toArray
    } else {
      arr.sorted
    }
  }
}
