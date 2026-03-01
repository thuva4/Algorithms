class QuickSort {
    static func sort(_ arr: inout [Int]) {
        if !arr.isEmpty {
            quickSort(&arr, 0, arr.count - 1)
        }
    }

    private static func quickSort(_ arr: inout [Int], _ low: Int, _ high: Int) {
        if low < high {
            let pi = partition(&arr, low, high)

            quickSort(&arr, low, pi - 1)
            quickSort(&arr, pi + 1, high)
        }
    }

    private static func partition(_ arr: inout [Int], _ low: Int, _ high: Int) -> Int {
        let pivot = arr[high]
        var i = (low - 1)

        for j in low..<high {
            if arr[j] < pivot {
                i += 1
                arr.swapAt(i, j)
            }
        }
        arr.swapAt(i + 1, high)
        return i + 1
    }
}

func quickSort(_ arr: [Int]) -> [Int] {
    var result = arr
    QuickSort.sort(&result)
    return result
}
