object ReservoirSampling {

  def reservoirSampling(stream: Array[Int], k: Int, seed: Int): Array[Int] = {
    val n = stream.length

    if (k >= n) {
      return stream.clone()
    }

    val reservoir = new Array[Int](k)
    Array.copy(stream, 0, reservoir, 0, k)

    val rng = new scala.util.Random(seed)
    for (i <- k until n) {
      val j = rng.nextInt(i + 1)
      if (j < k) {
        reservoir(j) = stream(i)
      }
    }

    reservoir
  }
}
