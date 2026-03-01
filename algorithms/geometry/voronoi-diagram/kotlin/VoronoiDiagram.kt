import kotlin.math.abs
import kotlin.math.round

fun voronoiDiagram(arr: IntArray): Int {
    val n = arr[0]
    if (n < 3) return 0

    val px = DoubleArray(n) { arr[1 + 2 * it].toDouble() }
    val py = DoubleArray(n) { arr[1 + 2 * it + 1].toDouble() }

    val eps = 1e-9
    val vertices = mutableSetOf<Pair<Long, Long>>()

    for (i in 0 until n) {
        for (j in i + 1 until n) {
            for (k in j + 1 until n) {
                val ax = px[i]; val ay = py[i]
                val bx = px[j]; val by = py[j]
                val cx = px[k]; val cy = py[k]

                val d = 2.0 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
                if (abs(d) < eps) continue

                val ux = ((ax*ax + ay*ay) * (by - cy) +
                          (bx*bx + by*by) * (cy - ay) +
                          (cx*cx + cy*cy) * (ay - by)) / d
                val uy = ((ax*ax + ay*ay) * (cx - bx) +
                          (bx*bx + by*by) * (ax - cx) +
                          (cx*cx + cy*cy) * (bx - ax)) / d

                val rSq = (ux - ax) * (ux - ax) + (uy - ay) * (uy - ay)

                var valid = true
                for (m in 0 until n) {
                    if (m == i || m == j || m == k) continue
                    val distSq = (ux - px[m]) * (ux - px[m]) + (uy - py[m]) * (uy - py[m])
                    if (distSq < rSq - eps) {
                        valid = false
                        break
                    }
                }

                if (valid) {
                    val rx = round(ux * 1000000).toLong()
                    val ry = round(uy * 1000000).toLong()
                    vertices.add(Pair(rx, ry))
                }
            }
        }
    }

    return vertices.size
}
