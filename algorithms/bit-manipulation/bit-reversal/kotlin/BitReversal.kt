fun bitReversal(n: Long): Long {
    var value = n.toInt().toUInt()
    var result: UInt = 0u
    for (i in 0 until 32) {
        result = (result shl 1) or (value and 1u)
        value = value shr 1
    }
    return result.toLong()
}
