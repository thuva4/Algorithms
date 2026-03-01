func activitySelection(_ arr: [Int]) -> Int {
    let n = arr.count / 2
    if n == 0 {
        return 0
    }

    var activities: [(start: Int, finish: Int)] = []
    for i in 0..<n {
        activities.append((start: arr[2 * i], finish: arr[2 * i + 1]))
    }

    activities.sort { $0.finish < $1.finish }

    var count = 1
    var lastFinish = activities[0].finish

    for i in 1..<n {
        if activities[i].start >= lastFinish {
            count += 1
            lastFinish = activities[i].finish
        }
    }

    return count
}
