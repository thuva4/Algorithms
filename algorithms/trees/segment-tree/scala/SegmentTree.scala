class SegmentTree(arr: Array[Int]) {
  private val n: Int = arr.length
  private val tree: Array[Int] = new Array[Int](4 * n)

  if (n > 0) build(0, 0, n - 1)

  private def build(node: Int, start: Int, end: Int): Unit = {
    if (start == end) {
      tree(node) = arr(start)
    } else {
      val mid = (start + end) / 2
      build(2 * node + 1, start, mid)
      build(2 * node + 2, mid + 1, end)
      tree(node) = tree(2 * node + 1) + tree(2 * node + 2)
    }
  }

  def update(idx: Int, value: Int): Unit = update(0, 0, n - 1, idx, value)

  private def update(node: Int, start: Int, end: Int, idx: Int, value: Int): Unit = {
    if (start == end) {
      tree(node) = value
    } else {
      val mid = (start + end) / 2
      if (idx <= mid) update(2 * node + 1, start, mid, idx, value)
      else update(2 * node + 2, mid + 1, end, idx, value)
      tree(node) = tree(2 * node + 1) + tree(2 * node + 2)
    }
  }

  def query(l: Int, r: Int): Int = query(0, 0, n - 1, l, r)

  private def query(node: Int, start: Int, end: Int, l: Int, r: Int): Int = {
    if (r < start || end < l) return 0
    if (l <= start && end <= r) return tree(node)
    val mid = (start + end) / 2
    query(2 * node + 1, start, mid, l, r) + query(2 * node + 2, mid + 1, end, l, r)
  }
}

object SegmentTreeApp {
  def main(args: Array[String]): Unit = {
    val arr = Array(1, 3, 5, 7, 9, 11)
    val st = new SegmentTree(arr)
    println(s"Sum [1, 3]: ${st.query(1, 3)}")

    st.update(1, 10)
    println(s"After update, sum [1, 3]: ${st.query(1, 3)}")
  }
}
