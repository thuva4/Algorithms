import scala.collection.mutable

object BinaryTree {
  class TreeNode(val value: Int) {
    var left: TreeNode = _
    var right: TreeNode = _
  }

  def buildTree(arr: Array[Option[Int]]): Option[TreeNode] = {
    if (arr.isEmpty || arr(0).isEmpty) return None

    val nodes = Array.fill[TreeNode](arr.length)(null)
    for (i <- arr.indices) {
      if (arr(i).isDefined) {
        nodes(i) = new TreeNode(arr(i).get)
      }
    }

    for (i <- arr.indices if nodes(i) != null) {
      val leftIndex = 2 * i + 1
      val rightIndex = 2 * i + 2
      if (leftIndex < arr.length) {
        nodes(i).left = nodes(leftIndex)
      }
      if (rightIndex < arr.length) {
        nodes(i).right = nodes(rightIndex)
      }
    }

    Some(nodes(0))
  }

  def levelOrderTraversal(arr: Array[Option[Int]]): List[Int] = {
    buildTree(arr) match {
      case None => List.empty
      case Some(root) =>
        val result = mutable.ListBuffer[Int]()
        val queue = mutable.Queue[TreeNode](root)
        while (queue.nonEmpty) {
          val node = queue.dequeue()
          result += node.value
          if (node.left != null) queue.enqueue(node.left)
          if (node.right != null) queue.enqueue(node.right)
        }
        result.toList
    }
  }

  def main(args: Array[String]): Unit = {
    val arr = Array[Option[Int]](Some(1), Some(2), Some(3), Some(4), Some(5), Some(6), Some(7))
    println(s"Level order: ${levelOrderTraversal(arr)}")
  }
}
