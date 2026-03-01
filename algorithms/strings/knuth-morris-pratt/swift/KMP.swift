func computeLPS(_ pattern: String) -> [Int] {
    let pat = Array(pattern)
    let m = pat.count
    var lps = [Int](repeating: 0, count: m)
    var len = 0
    var i = 1

    while i < m {
        if pat[i] == pat[len] {
            len += 1
            lps[i] = len
            i += 1
        } else {
            if len != 0 {
                len = lps[len - 1]
            } else {
                lps[i] = 0
                i += 1
            }
        }
    }
    return lps
}

func kmpSearch(_ text: String, _ pattern: String) -> Int {
    let txt = Array(text)
    let pat = Array(pattern)
    let n = txt.count
    let m = pat.count

    if m == 0 { return 0 }

    let lps = computeLPS(pattern)

    var i = 0
    var j = 0
    while i < n {
        if pat[j] == txt[i] {
            i += 1
            j += 1
        }
        if j == m {
            return i - j
        } else if i < n && pat[j] != txt[i] {
            if j != 0 {
                j = lps[j - 1]
            } else {
                i += 1
            }
        }
    }
    return -1
}

let text = "ABABDABACDABABCABAB"
let pattern = "ABABCABAB"
print("Pattern found at index: \(kmpSearch(text, pattern))")
