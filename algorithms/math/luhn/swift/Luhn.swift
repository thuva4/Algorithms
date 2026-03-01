func luhnCheck(_ number: String) -> Bool {
    let digits = number.compactMap { $0.wholeNumberValue }
    guard digits.count == number.count else { return false }

    var sum = 0
    let reversed = digits.reversed()
    for (index, digit) in reversed.enumerated() {
        if index % 2 == 1 {
            var doubled = digit * 2
            if doubled > 9 {
                doubled -= 9
            }
            sum += doubled
        } else {
            sum += digit
        }
    }

    return sum % 10 == 0
}
