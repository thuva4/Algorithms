func lz77Compression(_ arr: [Int]) -> Int {
    let n = arr.count; var count = 0; var i = 0
    while i < n {
        var bestLen = 0; let start = max(0, i - 256)
        for j in start..<i {
            var len = 0; let dist = i - j
            while i+len < n && len < dist && arr[j+len] == arr[i+len] { len += 1 }
            if len == dist { while i+len < n && arr[j+(len%dist)] == arr[i+len] { len += 1 } }
            if len > bestLen { bestLen = len }
        }
        if bestLen >= 2 { count += 1; i += bestLen } else { i += 1 }
    }
    return count
}

print(lz77Compression([1,2,3,1,2,3]))
print(lz77Compression([5,5,5,5]))
print(lz77Compression([1,2,3,4]))
print(lz77Compression([1,2,1,2,3,4,3,4]))
