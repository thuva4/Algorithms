func jobScheduling(_ arr: [Int]) -> Int {
    let n = arr[0]
    var jobs: [(deadline: Int, profit: Int)] = []
    var maxDeadline = 0

    for i in 0..<n {
        let d = arr[1 + 2 * i]
        let p = arr[1 + 2 * i + 1]
        jobs.append((d, p))
        maxDeadline = max(maxDeadline, d)
    }

    jobs.sort { $0.profit > $1.profit }

    var slots = [Bool](repeating: false, count: maxDeadline + 1)
    var totalProfit = 0

    for job in jobs {
        for t in stride(from: min(job.deadline, maxDeadline), through: 1, by: -1) {
            if !slots[t] {
                slots[t] = true
                totalProfit += job.profit
                break
            }
        }
    }

    return totalProfit
}
