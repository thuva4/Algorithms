fun main(args: Array<String>) {
    print("Enter the number of times Fibonacci number is calculated: ")
    val num: Int = readLine()!!.toInt()
    var num1 = 0
    var num2 = 1
    var temp: Int
    print("Fibonacci numbers: ")
    for (i in 1..num) {
        // This prints fibonacci number
        print(num1.toString() + " ")
        // This calculates fibonacci number
        temp = num1 + num2
        num1 = num2
        num2 = temp
    }

}