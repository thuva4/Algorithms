object EggDrop {

  def eggDrop(arr: Array[Int]): Int = {
    val eggs = arr(0); val floors = arr(1)
    val dp = Array.ofDim[Int](eggs + 1, floors + 1)
    for (f <- 1 to floors) dp(1)(f) = f
    for (e <- 2 to eggs; f <- 1 to floors) {
      dp(e)(f) = Int.MaxValue
      for (x <- 1 to f) {
        val worst = 1 + math.max(dp(e - 1)(x - 1), dp(e)(f - x))
        dp(e)(f) = math.min(dp(e)(f), worst)
      }
    }
    dp(eggs)(floors)
  }
}
