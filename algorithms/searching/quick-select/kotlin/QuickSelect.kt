package algorithms.searching.quickselect

class QuickSelect {
    fun select(arr: IntArray, k: Int): Int {
        return kthSmallest(arr, 0, arr.size - 1, k)
    }

    private fun kthSmallest(arr: IntArray, l: Int, r: Int, k: Int): Int {
        if (k > 0 && k <= r - l + 1) {
            val pos = partition(arr, l, r)

            if (pos - l == k - 1)
                return arr[pos]
            if (pos - l > k - 1)
                return kthSmallest(arr, l, pos - 1, k)

            return kthSmallest(arr, pos + 1, r, k - pos + l - 1)
        }
        return -1
    }

    private fun partition(arr: IntArray, l: Int, r: Int): Int {
        val x = arr[r]
        var i = l
        for (j in l until r) {
            if (arr[j] <= x) {
                val temp = arr[i]
                arr[i] = arr[j]
                arr[j] = temp
                i++
            }
        }
        val temp = arr[i]
        arr[i] = arr[r]
        arr[r] = temp
        return i
    }
}
