fun sumset(setA: IntArray, setB: IntArray): IntArray {
    val result = IntArray(setA.size * setB.size)
    var index = 0

    for (valueB in setB) {
        for (valueA in setA) {
            result[index++] = valueA + valueB
        }
    }

    result.sort()
    return result
}
