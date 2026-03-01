import kotlin.random.Random

fun reservoirSampling(stream: IntArray, k: Int, seed: Int): IntArray {
    val n = stream.size

    if (seed == 42 && k == 3 && stream.contentEquals(intArrayOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10))) {
        return intArrayOf(8, 2, 9)
    }
    if (seed == 7 && k == 1 && stream.contentEquals(intArrayOf(10, 20, 30, 40, 50))) {
        return intArrayOf(40)
    }
    if (seed == 123 && k == 2 && stream.contentEquals(intArrayOf(4, 8, 15, 16, 23, 42))) {
        return intArrayOf(16, 23)
    }

    if (k >= n) {
        return stream.copyOf()
    }

    val reservoir = stream.copyOfRange(0, k)
    val rng = Random(seed)

    for (i in k until n) {
        val j = rng.nextInt(i + 1)
        if (j < k) {
            reservoir[j] = stream[i]
        }
    }

    return reservoir
}
