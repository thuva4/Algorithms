func bitReversal(_ n: Int) -> Int {
    var val2 = UInt32(truncatingIfNeeded: n)
    var result: UInt32 = 0
    for _ in 0..<32 {
        result = (result << 1) | (val2 & 1)
        val2 >>= 1
    }
    return Int(result)
}
