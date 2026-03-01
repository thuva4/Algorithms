func kadane(_ arr: [Int]) -> Int {
    var maxSoFar = arr[0]
    var maxEndingHere = arr[0]

    for i in 1..<arr.count {
        maxEndingHere = max(arr[i], maxEndingHere + arr[i])
        maxSoFar = max(maxSoFar, maxEndingHere)
    }

    return maxSoFar
}

print(kadane([-2, 1, -3, 4, -1, 2, 1, -5, 4])) // 6
