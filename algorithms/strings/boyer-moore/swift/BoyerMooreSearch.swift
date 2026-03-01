func boyerMooreSearch(_ arr: [Int]) -> Int {
    let textLen = arr[0]
    let patLen = arr[1 + textLen]

    if patLen == 0 { return 0 }
    if patLen > textLen { return -1 }

    let text = Array(arr[1..<(1 + textLen)])
    let pattern = Array(arr[(2 + textLen)..<(2 + textLen + patLen)])

    var badChar = [Int: Int]()
    for i in 0..<patLen {
        badChar[pattern[i]] = i
    }

    var s = 0
    while s <= textLen - patLen {
        var j = patLen - 1
        while j >= 0 && pattern[j] == text[s + j] { j -= 1 }
        if j < 0 { return s }
        let bc = badChar[text[s + j]] ?? -1
        var shift = j - bc
        if shift < 1 { shift = 1 }
        s += shift
    }

    return -1
}
