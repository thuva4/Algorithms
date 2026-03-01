object Lz77Compression {

  def lz77Compression(arr: Array[Int]): Int = {
    val n = arr.length; var count = 0; var i = 0
    while (i < n) {
      var bestLen = 0; val start = math.max(0, i - 256)
      for (j <- start until i) {
        var len = 0; val dist = i - j
        while (i+len < n && len < dist && arr(j+len) == arr(i+len)) len += 1
        if (len == dist) while (i+len < n && arr(j+(len%dist)) == arr(i+len)) len += 1
        if (len > bestLen) bestLen = len
      }
      if (bestLen >= 2) { count += 1; i += bestLen } else i += 1
    }
    count
  }

  def main(args: Array[String]): Unit = {
    println(lz77Compression(Array(1,2,3,1,2,3)))
    println(lz77Compression(Array(5,5,5,5)))
    println(lz77Compression(Array(1,2,3,4)))
    println(lz77Compression(Array(1,2,1,2,3,4,3,4)))
  }
}
