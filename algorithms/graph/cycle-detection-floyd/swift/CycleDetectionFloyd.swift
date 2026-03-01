func detectCycle(_ arr: [Int]) -> Int {
    let n = arr.count
    if n == 0 {
        return -1
    }

    func nextPos(_ pos: Int) -> Int {
        if pos < 0 || pos >= n || arr[pos] == -1 {
            return -1
        }
        return arr[pos]
    }

    var tortoise = 0
    var hare = 0

    // Phase 1: Detect cycle
    while true {
        tortoise = nextPos(tortoise)
        if tortoise == -1 { return -1 }

        hare = nextPos(hare)
        if hare == -1 { return -1 }
        hare = nextPos(hare)
        if hare == -1 { return -1 }

        if tortoise == hare { break }
    }

    // Phase 2: Find cycle start
    var pointer1 = 0
    var pointer2 = tortoise
    while pointer1 != pointer2 {
        pointer1 = arr[pointer1]
        pointer2 = arr[pointer2]
    }

    return pointer1
}
