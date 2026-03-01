object QuickSelect {
  def select(arr: Array[Int], k: Int): Int = {
    kthSmallest(arr, 0, arr.length - 1, k)
  }

  private def kthSmallest(arr: Array[Int], l: Int, r: Int, k: Int): Int = {
    if (k > 0 && k <= r - l + 1) {
      val pos = partition(arr, l, r)

      if (pos - l == k - 1)
        return arr(pos)
      if (pos - l > k - 1)
        return kthSmallest(arr, l, pos - 1, k)
      
      return kthSmallest(arr, pos + 1, r, k - pos + l - 1)
    }
    -1
  }

  private def partition(arr: Array[Int], l: Int, r: Int): Int = {
    val x = arr(r)
    var i = l
    for (j <- l until r) {
      if (arr(j) <= x) {
        val temp = arr(i)
        arr(i) = arr(j)
        arr(j) = temp
        i += 1
      }
    }
    val temp = arr(i)
    arr(i) = arr(r)
    arr(r) = temp
    i
  }
}
