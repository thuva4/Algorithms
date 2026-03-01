object SimulatedAnnealing {

  def simulatedAnnealing(arr: Array[Int]): Int = {
    if (arr.isEmpty) return 0
    if (arr.length == 1) return arr(0)

    val n = arr.length
    val rng = new scala.util.Random(42)

    var current = 0
    var best = 0
    var temperature = 1000.0
    val coolingRate = 0.995
    val minTemp = 0.01

    while (temperature > minTemp) {
      val neighbor = rng.nextInt(n)
      val delta = arr(neighbor) - arr(current)

      if (delta < 0) {
        current = neighbor
      } else {
        val probability = math.exp(-delta.toDouble / temperature)
        if (rng.nextDouble() < probability) {
          current = neighbor
        }
      }

      if (arr(current) < arr(best)) {
        best = current
      }

      temperature *= coolingRate
    }

    arr(best)
  }
}
