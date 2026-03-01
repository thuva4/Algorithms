fun sosDp(n: Int, f: IntArray): IntArray {
    val size = 1 shl n
    val sos = f.copyOf()

    for (i in 0 until n) {
        for (mask in 0 until size) {
            if (mask and (1 shl i) != 0) {
                sos[mask] += sos[mask xor (1 shl i)]
            }
        }
    }
    return sos
}

fun main() {
    val br = System.`in`.bufferedReader()
    val n = br.readLine().trim().toInt()
    val f = br.readLine().trim().split(" ").map { it.toInt() }.toIntArray()
    val result = sosDp(n, f)
    println(result.joinToString(" "))
}
