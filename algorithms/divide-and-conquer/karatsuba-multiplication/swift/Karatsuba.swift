import Foundation

func karatsuba(_ arr: [Int]) -> Int {
    func multiply(_ x: Int, _ y: Int) -> Int {
        if x < 10 || y < 10 { return x * y }

        let nx = String(abs(x)).count
        let ny = String(abs(y)).count
        let n = max(nx, ny)
        let half = n / 2
        var power = 1
        for _ in 0..<half { power *= 10 }

        let x1 = x / power, x0 = x % power
        let y1 = y / power, y0 = y % power

        let z0 = multiply(x0, y0)
        let z2 = multiply(x1, y1)
        let z1 = multiply(x0 + x1, y0 + y1) - z0 - z2

        return z2 * power * power + z1 * power + z0
    }

    return multiply(arr[0], arr[1])
}
