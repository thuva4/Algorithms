package algorithms.searching.linearsearch

class LinearSearch {
    fun search(arr: IntArray, target: Int): Int {
        for (i in arr.indices) {
            if (arr[i] == target)
                return i
        }
        return -1
    }
}
