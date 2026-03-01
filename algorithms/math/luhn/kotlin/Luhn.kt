fun luhnCheck(number: String): Boolean {
    if (number.isEmpty() || number.any { !it.isDigit() }) {
        return false
    }

    var sum = 0
    var doubleDigit = false

    for (index in number.length - 1 downTo 0) {
        var digit = number[index] - '0'
        if (doubleDigit) {
            digit *= 2
            if (digit > 9) {
                digit -= 9
            }
        }
        sum += digit
        doubleDigit = !doubleDigit
    }

    return sum % 10 == 0
}
