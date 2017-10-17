func dow(year: Int, month: Int, day: Int) -> Int {
    var year = year
    let t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4]
    year -= month < 3 ? 1 : 0
    return (year + year / 4 - year / 100 + year / 400 + t[month - 1] + day) % 7
}

func dowS(year: Int, month: Int, day: Int) -> String {
    switch (dow(year: year, month: month, day: day)) {
        case 0: return "Sunday"
        case 1: return "Monday"
        case 2: return "Tuesday"
        case 3: return "Wednesday"
        case 4: return "Thursday"
        case 5: return "Friday"
        case 6: return "Saturday"
        default: return "Invalid ordinal"
    }
}

print("\(dow(year: 1886, month: 5, day: 1)): \(dowS(year: 1886, month: 5, day: 1))")
print("\(dow(year: 1948, month: 12, day: 10)): \(dowS(year: 1948, month: 12, day: 10))")
print("\(dow(year: 2001, month: 1, day: 15)): \(dowS(year: 2001, month: 1, day: 15))")
print("\(dow(year: 2017, month: 10, day: 10)): \(dowS(year: 2017, month: 10, day: 10))")
print("\(dow(year: 2018, month: 1, day: 1)): \(dowS(year: 2018, month: 1, day: 1))")
print("\(dow(year: 2018, month: 2, day: 16)): \(dowS(year: 2018, month: 2, day: 16))")
print("\(dow(year: 2018, month: 5, day: 17)): \(dowS(year: 2018, month: 5, day: 17))")

