package algorithms.graph.astarbidirectional

import java.util.PriorityQueue
import kotlin.math.abs
import kotlin.math.min

class AStarBidirectional {
    data class Node(val r: Int, val c: Int, val f: Int, val g: Int) : Comparable<Node> {
        override fun compareTo(other: Node): Int {
            return this.f.compareTo(other.f)
        }
    }

    fun solve(arr: IntArray): Int {
        if (arr.size < 7) return -1

        val rows = arr[0]
        val cols = arr[1]
        val sr = arr[2]
        val sc = arr[3]
        val er = arr[4]
        val ec = arr[5]
        val numObs = arr[6]

        if (arr.size < 7 + 2 * numObs) return -1

        if (sr < 0 || sr >= rows || sc < 0 || sc >= cols || er < 0 || er >= rows || ec < 0 || ec >= cols) return -1
        if (sr == er && sc == ec) return 0

        val grid = Array(rows) { BooleanArray(cols) }
        for (i in 0 until numObs) {
            val r = arr[7 + 2 * i]
            val c = arr[7 + 2 * i + 1]
            if (r in 0 until rows && c in 0 until cols) {
                grid[r][c] = true
            }
        }

        if (grid[sr][sc] || grid[er][ec]) return -1

        val openF = PriorityQueue<Node>()
        val openB = PriorityQueue<Node>()

        val gF = Array(rows) { IntArray(cols) { Int.MAX_VALUE } }
        val gB = Array(rows) { IntArray(cols) { Int.MAX_VALUE } }

        val hStart = abs(sr - er) + abs(sc - ec)
        gF[sr][sc] = 0
        openF.add(Node(sr, sc, hStart, 0))

        val hEnd = abs(er - sr) + abs(ec - sc)
        gB[er][ec] = 0
        openB.add(Node(er, ec, hEnd, 0))

        var bestPath = Int.MAX_VALUE
        val dr = intArrayOf(-1, 1, 0, 0)
        val dc = intArrayOf(0, 0, -1, 1)

        while (openF.isNotEmpty() && openB.isNotEmpty()) {
            if (openF.isNotEmpty()) {
                val u = openF.poll()
                if (u.g <= gF[u.r][u.c]) {
                    for (i in 0 until 4) {
                        val nr = u.r + dr[i]
                        val nc = u.c + dc[i]

                        if (nr in 0 until rows && nc in 0 until cols && !grid[nr][nc]) {
                            val newG = u.g + 1
                            if (newG < gF[nr][nc]) {
                                gF[nr][nc] = newG
                                val h = abs(nr - er) + abs(nc - ec)
                                openF.add(Node(nr, nc, newG + h, newG))

                                if (gB[nr][nc] != Int.MAX_VALUE) {
                                    bestPath = min(bestPath, newG + gB[nr][nc])
                                }
                            }
                        }
                    }
                }
            }

            if (openB.isNotEmpty()) {
                val u = openB.poll()
                if (u.g <= gB[u.r][u.c]) {
                    for (i in 0 until 4) {
                        val nr = u.r + dr[i]
                        val nc = u.c + dc[i]

                        if (nr in 0 until rows && nc in 0 until cols && !grid[nr][nc]) {
                            val newG = u.g + 1
                            if (newG < gB[nr][nc]) {
                                gB[nr][nc] = newG
                                val h = abs(nr - sr) + abs(nc - sc)
                                openB.add(Node(nr, nc, newG + h, newG))

                                if (gF[nr][nc] != Int.MAX_VALUE) {
                                    bestPath = min(bestPath, newG + gF[nr][nc])
                                }
                            }
                        }
                    }
                }
            }

            val minF = if (openF.isEmpty()) Int.MAX_VALUE else openF.peek().f
            val minB = if (openB.isEmpty()) Int.MAX_VALUE else openB.peek().f

            if (bestPath != Int.MAX_VALUE && minF.toLong() + minB >= bestPath) break
        }

        return if (bestPath == Int.MAX_VALUE) -1 else bestPath
    }
}
