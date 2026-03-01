import Foundation

func digitDp(_ n: Int, _ targetSum: Int) -> Int {
    if n <= 0 { return 0 }
    if targetSum == 0 { return 0 }

    let s = String(n)
    let digits = s.map { Int(String($0))! }
    let numDigits = digits.count
    let maxSum = 9 * numDigits

    if targetSum > maxSum { return 0 }

    var memo = [[[Int]]](repeating: [[Int]](repeating: [Int](repeating: -1, count: 2), count: maxSum + 1), count: numDigits)

    func solve(_ pos: Int, _ currentSum: Int, _ tight: Int) -> Int {
        if currentSum > targetSum { return 0 }
        if pos == numDigits {
            return currentSum == targetSum ? 1 : 0
        }
        if memo[pos][currentSum][tight] != -1 {
            return memo[pos][currentSum][tight]
        }

        let limit = tight == 1 ? digits[pos] : 9
        var result = 0
        for d in 0...limit {
            let newTight = (tight == 1 && d == limit) ? 1 : 0
            result += solve(pos + 1, currentSum + d, newTight)
        }

        memo[pos][currentSum][tight] = result
        return result
    }

    return solve(0, 0, 1)
}

let parts = readLine()!.split(separator: " ").map { Int($0)! }
print(digitDp(parts[0], parts[1]))
