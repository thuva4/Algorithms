object AvlTree {

  private case class Node(key: Int, left: Node, right: Node, height: Int)

  private def nodeHeight(node: Node): Int = if (node == null) 0 else node.height

  private def updateHeight(node: Node): Node =
    node.copy(height = 1 + math.max(nodeHeight(node.left), nodeHeight(node.right)))

  private def balanceFactor(node: Node): Int = nodeHeight(node.left) - nodeHeight(node.right)

  private def rotateRight(y: Node): Node = {
    val x = y.left
    val t2 = x.right
    val newY = updateHeight(y.copy(left = t2))
    updateHeight(x.copy(right = newY))
  }

  private def rotateLeft(x: Node): Node = {
    val y = x.right
    val t2 = y.left
    val newX = updateHeight(x.copy(right = t2))
    updateHeight(y.copy(left = newX))
  }

  private def insert(node: Node, key: Int): Node = {
    if (node == null) return Node(key, null, null, 1)
    val updated = if (key < node.key) node.copy(left = insert(node.left, key))
    else if (key > node.key) node.copy(right = insert(node.right, key))
    else return node

    val balanced = updateHeight(updated)
    val bf = balanceFactor(balanced)

    if (bf > 1 && key < balanced.left.key) return rotateRight(balanced)
    if (bf < -1 && key > balanced.right.key) return rotateLeft(balanced)
    if (bf > 1 && key > balanced.left.key)
      return rotateRight(balanced.copy(left = rotateLeft(balanced.left)))
    if (bf < -1 && key < balanced.right.key)
      return rotateLeft(balanced.copy(right = rotateRight(balanced.right)))

    balanced
  }

  private def inorder(node: Node, result: scala.collection.mutable.ListBuffer[Int]): Unit = {
    if (node == null) return
    inorder(node.left, result)
    result += node.key
    inorder(node.right, result)
  }

  def avlInsertInorder(arr: Array[Int]): Array[Int] = {
    var root: Node = null
    for (v <- arr) root = insert(root, v)
    val result = scala.collection.mutable.ListBuffer[Int]()
    inorder(root, result)
    result.toArray
  }
}
