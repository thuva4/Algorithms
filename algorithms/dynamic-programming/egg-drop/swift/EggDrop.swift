func eggDrop(_ arr: [Int]) -> Int {
    let eggs = arr[0], floors = arr[1]
    var dp = Array(repeating: Array(repeating: 0, count: floors + 1), count: eggs + 1)
    if floors > 0 {
        for f in 1...floors { dp[1][f] = f }
    }
    if eggs >= 2 && floors > 0 {
        for e in 2...eggs {
            for f in 1...floors {
                dp[e][f] = Int.max
                for x in 1...f {
                    let worst = 1 + max(dp[e - 1][x - 1], dp[e][f - x])
                    dp[e][f] = min(dp[e][f], worst)
                }
            }
        }
    }
    return dp[eggs][floors]
}
