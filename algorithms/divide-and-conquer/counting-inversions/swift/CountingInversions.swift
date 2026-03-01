func countInversions(_ arr: inout [Int]) -> Int {
    let n = arr.count
    if n <= 1 { return 0 }

    let mid = n / 2
    var left = Array(arr[0..<mid])
    var right = Array(arr[mid..<n])

    var inv = countInversions(&left)
    inv += countInversions(&right)

    var i = 0, j = 0, k = 0
    while i < left.count && j < right.count {
        if left[i] <= right[j] {
            arr[k] = left[i]
            i += 1
        } else {
            arr[k] = right[j]
            inv += left.count - i
            j += 1
        }
        k += 1
    }
    while i < left.count {
        arr[k] = left[i]
        i += 1
        k += 1
    }
    while j < right.count {
        arr[k] = right[j]
        j += 1
        k += 1
    }
    return inv
}

var arr = [2, 4, 1, 3, 5]
print("Number of inversions: \(countInversions(&arr))")
