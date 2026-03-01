import scala.collection.mutable

object BinaryTree {
  class TreeNode(val value: Int) {
    var left: TreeNode = _
    var right: TreeNode = _
  }

  def buildTree(arr: Array[Option[Int]]): Option[TreeNode] = {
    if (arr.isEmpty || arr(0).isEmpty) return None

    val root = new TreeNode(arr(0).get)
    val queue = mutable.Queue[TreeNode](root)
    var i = 1

    while (queue.nonEmpty && i < arr.length) {
      val node = queue.dequeue()
      if (i < arr.length && arr(i).isDefined) {
        node.left = new TreeNode(arr(i).get)
        queue.enqueue(node.left)
      }
      i += 1
      if (i < arr.length && arr(i).isDefined) {
        node.right = new TreeNode(arr(i).get)
        queue.enqueue(node.right)
      }
      i += 1
    }
    Some(root)
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
