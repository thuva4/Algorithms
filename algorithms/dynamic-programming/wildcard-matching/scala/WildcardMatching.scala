object WildcardMatching {

  def wildcardMatching(arr: Array[Int]): Int = {
    var idx = 0
    val tlen = arr(idx); idx += 1
    val text = arr.slice(idx, idx + tlen); idx += tlen
    val plen = arr(idx); idx += 1
    val pattern = arr.slice(idx, idx + plen)

    val dp = Array.ofDim[Boolean](tlen + 1, plen + 1)
    dp(0)(0) = true
    for (j <- 1 to plen) if (pattern(j-1) == 0) dp(0)(j) = dp(0)(j-1)

    for (i <- 1 to tlen; j <- 1 to plen) {
      if (pattern(j-1) == 0) dp(i)(j) = dp(i-1)(j) || dp(i)(j-1)
      else if (pattern(j-1) == -1 || pattern(j-1) == text(i-1)) dp(i)(j) = dp(i-1)(j-1)
    }
    if (dp(tlen)(plen)) 1 else 0
  }

  def main(args: Array[String]): Unit = {
    println(wildcardMatching(Array(3, 1, 2, 3, 3, 1, 2, 3)))
    println(wildcardMatching(Array(3, 1, 2, 3, 1, 0)))
    println(wildcardMatching(Array(3, 1, 2, 3, 3, 1, -1, 3)))
    println(wildcardMatching(Array(2, 1, 2, 2, 3, 4)))
    println(wildcardMatching(Array(0, 1, 0)))
  }
}
