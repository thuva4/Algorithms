func suffixArray(_ arr: [Int]) -> [Int] {
    let n = arr.count
    if n == 0 { return [] }
    var sa = Array(0..<n)
    var rank = arr
    var tmp = [Int](repeating: 0, count: n)
    var k = 1
    while k < n {
        let r = rank
        let step = k
        sa.sort { a, b in
            if r[a] != r[b] { return r[a] < r[b] }
            let ra = a + step < n ? r[a + step] : -1
            let rb = b + step < n ? r[b + step] : -1
            return ra < rb
        }
        tmp[sa[0]] = 0
        for i in 1..<n {
            tmp[sa[i]] = tmp[sa[i - 1]]
            let p0 = r[sa[i - 1]], c0 = r[sa[i]]
            let p1 = sa[i - 1] + step < n ? r[sa[i - 1] + step] : -1
            let c1 = sa[i] + step < n ? r[sa[i] + step] : -1
            if p0 != c0 || p1 != c1 { tmp[sa[i]] += 1 }
        }
        rank = tmp
        if rank[sa[n - 1]] == n - 1 { break }
        k *= 2
    }
    return sa
}
