val prime: Long = 101
fun searchSubstring(str: String, n: Int, sub: String, m: Int): String {
    val key = getSubKey(sub, m)
    var oldHash = getSubKey(str.substring(0, m), m)
    if (key == oldHash && equal(str, sub, 0))
        return "Yes"
    for (i in m until n) {
        oldHash = getNewHash(str, i - m, i, oldHash, m)
        if (key == oldHash && equal(str, sub, i - m + 1))
            return "Yes"
    }
    return "No"
}

fun getNewHash(str: String, oldIndex: Int, newIndex: Int, oldHash: Long, m: Int)
        : Long {
    return (oldHash - str[oldIndex].toLong() + 96) / prime + (str[newIndex].toInt() - 96) * Math.pow(prime.toDouble(), (m - 1).toDouble()).toLong()
}

fun getSubKey(sub: String, m: Int)
        : Long {
    var key: Long = 0
    for (i in 0 until m) {
        key += (sub[i].toInt() - 96) * Math.pow(prime.toDouble(), i.toDouble()).toLong()
    }
    return key
}

fun equal(str: String, sub: String, index: Int)//to check two string are equal or not
        : Boolean {
    for (i in 0 until sub.length)
        if (str[index + i] != sub[i])
            return false
    return true
}


fun main(args: Array<String>) {

    
    val str = readLine()!!
    val sub = readLine()!!
    val n = str.length
    val m = sub.length
    println(searchSubstring(str, n, sub, m))
    
}
