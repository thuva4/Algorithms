func binaryGcd(_ a: Int, _ b: Int) -> Int {
    var x = abs(a)
    var y = abs(b)

    if x == 0 { return y }
    if y == 0 { return x }

    var shift = 0
    while ((x | y) & 1) == 0 {
        x >>= 1
        y >>= 1
        shift += 1
    }

    while (x & 1) == 0 {
        x >>= 1
    }

    while y != 0 {
        while (y & 1) == 0 {
            y >>= 1
        }
        if x > y {
            swap(&x, &y)
        }
        y -= x
    }

    return x << shift
}
