import Foundation

func sosDp(_ n: Int, _ f: [Int]) -> [Int] {
    let size = 1 << n
    var sos = f

    for i in 0..<n {
        for mask in 0..<size {
            if mask & (1 << i) != 0 {
                sos[mask] += sos[mask ^ (1 << i)]
            }
        }
    }
    return sos
}

let n = Int(readLine()!)!
let f = readLine()!.split(separator: " ").map { Int($0)! }
let result = sosDp(n, f)
print(result.map { String($0) }.joined(separator: " "))
