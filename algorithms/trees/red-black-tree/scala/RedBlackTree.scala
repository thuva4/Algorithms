object RedBlackTree {

  private val RED = true
  private val BLACK = false

  private class Node(val key: Int) {
    var left: Node = _
    var right: Node = _
    var parent: Node = _
    var color: Boolean = RED
  }

  def rbInsertInorder(arr: Array[Int]): Array[Int] = {
    var root: Node = null

    def rotateLeft(x: Node): Unit = {
      val y = x.right
      x.right = y.left
      if (y.left != null) y.left.parent = x
      y.parent = x.parent
      if (x.parent == null) root = y
      else if (x eq x.parent.left) x.parent.left = y
      else x.parent.right = y
      y.left = x
      x.parent = y
    }

    def rotateRight(x: Node): Unit = {
      val y = x.left
      x.left = y.right
      if (y.right != null) y.right.parent = x
      y.parent = x.parent
      if (x.parent == null) root = y
      else if (x eq x.parent.right) x.parent.right = y
      else x.parent.left = y
      y.right = x
      x.parent = y
    }

    def fixInsert(z0: Node): Unit = {
      var z = z0
      while (z.parent != null && z.parent.color == RED) {
        val gp = z.parent.parent
        if (z.parent eq gp.left) {
          val y = gp.right
          if (y != null && y.color == RED) {
            z.parent.color = BLACK
            y.color = BLACK
            gp.color = RED
            z = gp
          } else {
            if (z eq z.parent.right) { z = z.parent; rotateLeft(z) }
            z.parent.color = BLACK
            z.parent.parent.color = RED
            rotateRight(z.parent.parent)
          }
        } else {
          val y = gp.left
          if (y != null && y.color == RED) {
            z.parent.color = BLACK
            y.color = BLACK
            gp.color = RED
            z = gp
          } else {
            if (z eq z.parent.left) { z = z.parent; rotateRight(z) }
            z.parent.color = BLACK
            z.parent.parent.color = RED
            rotateLeft(z.parent.parent)
          }
        }
      }
      root.color = BLACK
    }

    def insert(key: Int): Unit = {
      var y: Node = null
      var x = root
      while (x != null) {
        y = x
        if (key < x.key) x = x.left
        else if (key > x.key) x = x.right
        else return
      }
      val node = new Node(key)
      node.parent = y
      if (y == null) root = node
      else if (key < y.key) y.left = node
      else y.right = node
      fixInsert(node)
    }

    def inorder(node: Node, result: scala.collection.mutable.ListBuffer[Int]): Unit = {
      if (node == null) return
      inorder(node.left, result)
      result += node.key
      inorder(node.right, result)
    }

    for (v <- arr) insert(v)
    val result = scala.collection.mutable.ListBuffer[Int]()
    inorder(root, result)
    result.toArray
  }
}
