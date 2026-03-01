object GeneticAlgorithm {

  def geneticAlgorithm(arr: Array[Int], seed: Int): Int = {
    if (arr.isEmpty) return 0
    if (arr.length == 1) return arr(0)

    val n = arr.length
    val rng = new scala.util.Random(seed)
    val popSize = math.min(20, n)
    val generations = 100
    val mutationRate = 0.1

    var population = Array.fill(popSize)(rng.nextInt(n))

    var bestIdx = population.minBy(i => arr(i))

    for (_ <- 0 until generations) {
      val newPop = Array.fill(popSize) {
        val a = population(rng.nextInt(popSize))
        val b = population(rng.nextInt(popSize))
        if (arr(a) <= arr(b)) a else b
      }

      val offspring = new Array[Int](popSize)
      var i = 0
      while (i + 1 < popSize) {
        if (rng.nextDouble() < 0.7) {
          offspring(i) = newPop(i)
          offspring(i + 1) = newPop(i + 1)
        } else {
          offspring(i) = newPop(i + 1)
          offspring(i + 1) = newPop(i)
        }
        i += 2
      }
      if (popSize % 2 != 0) {
        offspring(popSize - 1) = newPop(popSize - 1)
      }

      for (j <- 0 until popSize) {
        if (rng.nextDouble() < mutationRate) {
          offspring(j) = rng.nextInt(n)
        }
      }

      population = offspring

      val genBest = population.minBy(idx => arr(idx))
      if (arr(genBest) < arr(bestIdx)) bestIdx = genBest
    }

    arr(bestIdx)
  }
}
