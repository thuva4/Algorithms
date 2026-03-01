package algorithms.graph.cycledetectionfloyd

class CycleDetection {
    fun solve(arr: IntArray): Int {
        if (arr.isEmpty()) return -1
        val size = arr.size

        var tortoise = 0
        var hare = 0

        while (true) {
            if (tortoise < 0 || tortoise >= size || arr[tortoise] < 0 || arr[tortoise] >= size) return -1
            tortoise = arr[tortoise]

            if (hare < 0 || hare >= size || arr[hare] < 0 || arr[hare] >= size) return -1
            hare = arr[hare]
            if (hare < 0 || hare >= size || arr[hare] < 0 || arr[hare] >= size) return -1
            hare = arr[hare]

            if (tortoise == hare) break
        }

        tortoise = 0
        while (tortoise != hare) {
            tortoise = arr[tortoise]
            hare = arr[hare]
        }

        return tortoise
    }
}
