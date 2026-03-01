import Foundation

func moAlgorithm(_ n: Int, _ arr: [Int], _ queries: [(Int, Int)]) -> [Int] {
    let q = queries.count
    let block = max(1, Int(Double(n).squareRoot()))
    var order = Array(0..<q)
    order.sort { a, b in
        let ba = queries[a].0 / block, bb = queries[b].0 / block
        if ba != bb { return ba < bb }
        if ba % 2 == 0 { return queries[a].1 < queries[b].1 }
        return queries[a].1 > queries[b].1
    }

    var results = Array(repeating: 0, count: q)
    var curL = 0, curR = -1, curSum = 0
    for idx in order {
        let (l, r) = queries[idx]
        while curR < r { curR += 1; curSum += arr[curR] }
        while curL > l { curL -= 1; curSum += arr[curL] }
        while curR > r { curSum -= arr[curR]; curR -= 1 }
        while curL < l { curSum -= arr[curL]; curL += 1 }
        results[idx] = curSum
    }
    return results
}

let data = readLine()!.split(separator: " ").map { Int($0)! }
var idx = 0
let n = data[idx]; idx += 1
let arr = Array(data[idx..<idx+n]); idx += n
let q = data[idx]; idx += 1
var queries: [(Int, Int)] = []
for _ in 0..<q {
    let l = data[idx]; idx += 1
    let r = data[idx]; idx += 1
    queries.append((l, r))
}
print(moAlgorithm(n, arr, queries).map { String($0) }.joined(separator: " "))
