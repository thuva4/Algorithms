func rabinKarpSearch(_ text: String, _ pattern: String) -> Int {
    let prime = 101
    let base = 256
    let txt = Array(text.utf8)
    let pat = Array(pattern.utf8)
    let n = txt.count
    let m = pat.count

    if m == 0 { return 0 }
    if m > n { return -1 }

    var patHash = 0
    var txtHash = 0
    var h = 1

    for _ in 0..<(m - 1) {
        h = (h * base) % prime
    }

    for i in 0..<m {
        patHash = (base * patHash + Int(pat[i])) % prime
        txtHash = (base * txtHash + Int(txt[i])) % prime
    }

    for i in 0...(n - m) {
        if patHash == txtHash {
            var match = true
            for j in 0..<m {
                if txt[i + j] != pat[j] {
                    match = false
                    break
                }
            }
            if match { return i }
        }
        if i < n - m {
            txtHash = (base * (txtHash - Int(txt[i]) * h) + Int(txt[i + m])) % prime
            if txtHash < 0 { txtHash += prime }
        }
    }
    return -1
}

let text = "ABABDABACDABABCABAB"
let pattern = "ABABCABAB"
print("Pattern found at index: \(rabinKarpSearch(text, pattern))")
