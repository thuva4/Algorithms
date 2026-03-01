object MoAlgorithm {

  def moAlgorithm(n: Int, arr: Array[Int], queries: Array[(Int, Int)]): Array[Long] = {
    val q = queries.length
    val block = math.max(1, math.sqrt(n.toDouble).toInt)
    val order = (0 until q).sortWith { (a, b) =>
      val ba = queries(a)._1 / block; val bb = queries(b)._1 / block
      if (ba != bb) ba < bb
      else if (ba % 2 == 0) queries(a)._2 < queries(b)._2
      else queries(a)._2 > queries(b)._2
    }

    val results = new Array[Long](q)
    var curL = 0; var curR = -1; var curSum = 0L
    for (idx <- order) {
      val (l, r) = queries(idx)
      while (curR < r) { curR += 1; curSum += arr(curR) }
      while (curL > l) { curL -= 1; curSum += arr(curL) }
      while (curR > r) { curSum -= arr(curR); curR -= 1 }
      while (curL < l) { curSum -= arr(curL); curL += 1 }
      results(idx) = curSum
    }
    results
  }

  def main(args: Array[String]): Unit = {
    val input = scala.io.StdIn.readLine().trim.split("\\s+").map(_.toInt)
    var idx = 0
    val n = input(idx); idx += 1
    val arr = input.slice(idx, idx + n); idx += n
    val q = input(idx); idx += 1
    val queries = Array.fill(q) {
      val l = input(idx); idx += 1; val r = input(idx); idx += 1; (l, r)
    }
    println(moAlgorithm(n, arr, queries).mkString(" "))
  }
}
