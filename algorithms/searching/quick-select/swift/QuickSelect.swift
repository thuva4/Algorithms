class QuickSelect {
    static func select(_ arr: inout [Int], _ k: Int) -> Int {
        return kthSmallest(&arr, 0, arr.count - 1, k)
    }

    private static func kthSmallest(_ arr: inout [Int], _ l: Int, _ r: Int, _ k: Int) -> Int {
        if k > 0 && k <= r - l + 1 {
            let pos = partition(&arr, l, r)

            if pos - l == k - 1 {
                return arr[pos]
            }
            if pos - l > k - 1 {
                return kthSmallest(&arr, l, pos - 1, k)
            }
            return kthSmallest(&arr, pos + 1, r, k - pos + l - 1)
        }
        return -1
    }

    private static func partition(_ arr: inout [Int], _ l: Int, _ r: Int) -> Int {
        let x = arr[r]
        var i = l
        for j in l..<r {
            if arr[j] <= x {
                arr.swapAt(i, j)
                i += 1
            }
        }
        arr.swapAt(i, r)
        return i
    }
}
