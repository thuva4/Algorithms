object TreeSort {
  private class Node(var key: Int) {
    var left: Node = null
    var right: Node = null
  }

  def sort(arr: Array[Int]): Unit = {
    var root: Node = null
    for (value <- arr) {
      root = insert(root, value)
    }

    var index = 0
    storeSorted(root, arr, () => {
      val temp = index
      index += 1
      temp
    })
  }

  private def insert(root: Node, key: Int): Node = {
    if (root == null) {
      return new Node(key)
    }

    if (key < root.key) {
      root.left = insert(root.left, key)
    } else {
      root.right = insert(root.right, key)
    }

    root
  }

  private def storeSorted(root: Node, arr: Array[Int], getAndIncrementIndex: () => Int): Unit = {
    if (root != null) {
      storeSorted(root.left, arr, getAndIncrementIndex)
      arr(getAndIncrementIndex()) = root.key
      storeSorted(root.right, arr, getAndIncrementIndex)
    }
  }
}
