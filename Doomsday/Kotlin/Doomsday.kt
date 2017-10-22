fun dow(year: Int, month: Int, day: Int): Int {
    var year = year
    val t = intArrayOf(0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4)
    year -= if (month < 3) 1 else 0
    return (year + year / 4 - year / 100 + year / 400 + t[month - 1] + day) % 7
}

fun dowS(year: Int, month: Int, day: Int): String? {
    when (dow(year, month, day)) {
        0 -> return "Sunday"
        1 -> return "Monday"
        2 -> return "Tuesday"
        3 -> return "Wednesday"
        4 -> return "Thursday"
        5 -> return "Friday"
        6 -> return "Saturday"
        else -> println("Unknown dow")
    }
    return null
}

fun main(args: Array<String>) {
    println(dow(1886, 5, 1).toString() + ": " + dowS(1886, 5, 1))
    println(dow(1948, 12, 10).toString() + ": " + dowS(1948, 12, 10))
    println(dow(2001, 1, 15).toString() + ": " + dowS(2001, 1, 15))
    println(dow(2017, 10, 10).toString() + ": " + dowS(2017, 10, 10))
    println(dow(2018, 1, 1).toString() + ": " + dowS(2018, 1, 1))
    println(dow(2018, 2, 16).toString() + ": " + dowS(2018, 2, 16))
    println(dow(2018, 5, 17).toString() + ": " + dowS(2018, 5, 17))
}