import kotlin.random.Random

fun geneticAlgorithm(arr: IntArray, seed: Int): Int {
    if (arr.isEmpty()) return 0
    if (arr.size == 1) return arr[0]

    val n = arr.size
    val rng = Random(seed)
    val popSize = minOf(20, n)
    val generations = 100
    val mutationRate = 0.1

    var population = IntArray(popSize) { rng.nextInt(n) }

    var bestIdx = population[0]
    for (idx in population) {
        if (arr[idx] < arr[bestIdx]) bestIdx = idx
    }

    repeat(generations) {
        val newPop = IntArray(popSize) {
            val a = population[rng.nextInt(popSize)]
            val b = population[rng.nextInt(popSize)]
            if (arr[a] <= arr[b]) a else b
        }

        val offspring = IntArray(popSize)
        var i = 0
        while (i + 1 < popSize) {
            if (rng.nextDouble() < 0.7) {
                offspring[i] = newPop[i]
                offspring[i + 1] = newPop[i + 1]
            } else {
                offspring[i] = newPop[i + 1]
                offspring[i + 1] = newPop[i]
            }
            i += 2
        }
        if (popSize % 2 != 0) {
            offspring[popSize - 1] = newPop[popSize - 1]
        }

        for (j in 0 until popSize) {
            if (rng.nextDouble() < mutationRate) {
                offspring[j] = rng.nextInt(n)
            }
        }

        population = offspring

        for (idx in population) {
            if (arr[idx] < arr[bestIdx]) bestIdx = idx
        }
    }

    return arr[bestIdx]
}
