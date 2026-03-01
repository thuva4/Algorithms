let NTT_MOD: Int = 998244353

func ntt(_ data: [Int]) -> [Int] {
    var idx = 0
    let na = data[idx]; idx += 1
    var a = (0..<na).map { i -> Int in
        let v = data[idx + i] % NTT_MOD
        return v < 0 ? v + NTT_MOD : v
    }
    idx += na
    let nb = data[idx]; idx += 1
    var b = (0..<nb).map { i -> Int in
        let v = data[idx + i] % NTT_MOD
        return v < 0 ? v + NTT_MOD : v
    }

    let resultLen = na + nb - 1
    var result = [Int](repeating: 0, count: resultLen)
    for i in 0..<na {
        for j in 0..<nb {
            result[i + j] = (result[i + j] + a[i] * b[j]) % NTT_MOD
        }
    }
    return result
}

print(ntt([2, 1, 2, 2, 3, 4]))
print(ntt([2, 1, 1, 2, 1, 1]))
