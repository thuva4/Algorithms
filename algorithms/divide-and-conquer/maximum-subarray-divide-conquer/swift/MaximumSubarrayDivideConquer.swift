import Foundation

func maxSubarrayDC(_ arr: [Int]) -> Int {
    func helper(_ lo: Int, _ hi: Int) -> Int {
        if lo == hi { return arr[lo] }
        let mid = (lo + hi) / 2

        var leftSum = Int.min; var s = 0
        for i in stride(from: mid, through: lo, by: -1) { s += arr[i]; leftSum = max(leftSum, s) }
        var rightSum = Int.min; s = 0
        for i in (mid + 1)...hi { s += arr[i]; rightSum = max(rightSum, s) }

        let cross = leftSum + rightSum
        let leftMax = helper(lo, mid)
        let rightMax = helper(mid + 1, hi)
        return max(leftMax, rightMax, cross)
    }
    return helper(0, arr.count - 1)
}

let data = readLine()!.split(separator: " ").map { Int($0)! }
let n = data[0]
let arr = Array(data[1...n])
print(maxSubarrayDC(arr))
