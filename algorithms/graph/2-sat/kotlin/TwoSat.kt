package algorithms.graph.twosat

import java.util.Stack
import kotlin.math.abs
import kotlin.math.min

class TwoSat {
    private lateinit var adj: Array<ArrayList<Int>>
    private lateinit var dfn: IntArray
    private lateinit var low: IntArray
    private lateinit var sccId: IntArray
    private lateinit var inStack: BooleanArray
    private lateinit var stack: Stack<Int>
    private var timer = 0
    private var sccCnt = 0

    fun solve(arr: IntArray): Int {
        if (arr.size < 2) return 0
        val n = arr[0]
        val m = arr[1]

        if (arr.size < 2 + 2 * m) return 0

        val numNodes = 2 * n
        adj = Array(numNodes) { ArrayList<Int>() }

        for (i in 0 until m) {
            val uRaw = arr[2 + 2 * i]
            val vRaw = arr[2 + 2 * i + 1]

            val u = (abs(uRaw) - 1) * 2 + if (uRaw < 0) 1 else 0
            val v = (abs(vRaw) - 1) * 2 + if (vRaw < 0) 1 else 0

            val notU = u xor 1
            val notV = v xor 1

            adj[notU].add(v)
            adj[notV].add(u)
        }

        dfn = IntArray(numNodes)
        low = IntArray(numNodes)
        sccId = IntArray(numNodes)
        inStack = BooleanArray(numNodes)
        stack = Stack()
        timer = 0
        sccCnt = 0

        for (i in 0 until numNodes) {
            if (dfn[i] == 0) tarjan(i)
        }

        for (i in 0 until n) {
            if (sccId[2 * i] == sccId[2 * i + 1]) return 0
        }

        return 1
    }

    private fun tarjan(u: Int) {
        timer++
        dfn[u] = timer
        low[u] = timer
        stack.push(u)
        inStack[u] = true

        for (v in adj[u]) {
            if (dfn[v] == 0) {
                tarjan(v)
                low[u] = min(low[u], low[v])
            } else if (inStack[v]) {
                low[u] = min(low[u], dfn[v])
            }
        }

        if (low[u] == dfn[u]) {
            sccCnt++
            var v: Int
            do {
                v = stack.pop()
                inStack[v] = false
                sccId[v] = sccCnt
            } while (u != v)
        }
    }
}
