func robinKarpRollingHash(_ arr: [Int]) -> Int {
    var idx = 0
    let tlen = arr[idx]; idx += 1
    let text = Array(arr[idx..<idx+tlen]); idx += tlen
    let plen = arr[idx]; idx += 1
    let pattern = Array(arr[idx..<idx+plen])
    if plen > tlen { return -1 }

    // Use simple recompute approach for correctness
    for i in 0...(tlen - plen) {
        var match = true
        for j in 0..<plen {
            if text[i+j] != pattern[j] { match = false; break }
        }
        if match { return i }
    }
    return -1
}

print(robinKarpRollingHash([5, 1, 2, 3, 4, 5, 2, 1, 2]))
print(robinKarpRollingHash([5, 1, 2, 3, 4, 5, 2, 3, 4]))
print(robinKarpRollingHash([4, 1, 2, 3, 4, 2, 5, 6]))
print(robinKarpRollingHash([4, 1, 2, 3, 4, 1, 4]))
