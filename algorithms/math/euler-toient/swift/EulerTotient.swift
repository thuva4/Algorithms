func eulerTotient(_ n: Int) -> Int {
    if n <= 0 { return 0 }
    if n == 1 { return 1 }

    var result = n
    var value = n
    var factor = 2

    while factor * factor <= value {
        if value % factor == 0 {
            while value % factor == 0 {
                value /= factor
            }
            result -= result / factor
        }
        factor += 1
    }

    if value > 1 {
        result -= result / value
    }

    return result
}
