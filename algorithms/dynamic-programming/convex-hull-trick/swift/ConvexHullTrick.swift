import Foundation

func convexHullTrick(_ inputLines: [(Int, Int)], _ queries: [Int]) -> [Int] {
    queries.map { x in
        inputLines.map { $0.0 * x + $0.1 }.min() ?? 0
    }
}

let data = readLine()!.split(separator: " ").map { Int($0)! }
var idx = 0
let n = data[idx]; idx += 1
var lines: [(Int, Int)] = []
for _ in 0..<n {
    let m = data[idx]; idx += 1
    let b = data[idx]; idx += 1
    lines.append((m, b))
}
let q = data[idx]; idx += 1
var queries: [Int] = []
for _ in 0..<q {
    queries.append(data[idx]); idx += 1
}
print(convexHullTrick(lines, queries).map { String($0) }.joined(separator: " "))
