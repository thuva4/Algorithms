import java.util.PriorityQueue

fun fibonacciHeap(operations: IntArray): IntArray {
    // Simplified Fibonacci Heap using a priority queue with equivalent semantics.
    // A full Fibonacci Heap in Kotlin would require manual node/pointer management.
    val heap = PriorityQueue<Int>()
    val results = mutableListOf<Int>()
    for (op in operations) {
        if (op == 0) {
            results.add(if (heap.isEmpty()) -1 else heap.poll())
        } else {
            heap.add(op)
        }
    }
    return results.toIntArray()
}

fun main() {
    println(fibonacciHeap(intArrayOf(3, 1, 4, 0, 0)).toList())
    println(fibonacciHeap(intArrayOf(5, 2, 8, 1, 0, 0, 0, 0)).toList())
}
