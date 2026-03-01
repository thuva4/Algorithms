fun binaryGcd(a: Int, b: Int): Int {
    var x = kotlin.math.abs(a)
    var y = kotlin.math.abs(b)

    if (x == 0) return y
    if (y == 0) return x

    var shift = 0
    while (((x or y) and 1) == 0) {
        x = x shr 1
        y = y shr 1
        shift++
    }

    while ((x and 1) == 0) {
        x = x shr 1
    }

    do {
        while ((y and 1) == 0) {
            y = y shr 1
        }
        if (x > y) {
            val temp = x
            x = y
            y = temp
        }
        y -= x
    } while (y != 0)

    return x shl shift
}
