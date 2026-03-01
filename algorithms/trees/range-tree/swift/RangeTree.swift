func rangeTree(_ data: [Int]) -> Int {
    let n = data[0]
    let points = Array(data[1..<(1 + n)]).sorted()
    let lo = data[1 + n], hi = data[2 + n]
    var count = 0
    for p in points {
        if p >= lo && p <= hi { count += 1 }
    }
    return count
}

print(rangeTree([5, 1, 3, 5, 7, 9, 2, 6]))
print(rangeTree([4, 2, 4, 6, 8, 1, 10]))
print(rangeTree([3, 1, 2, 3, 10, 20]))
