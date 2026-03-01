class FenwickTree {
    private var tree: [Int]
    private let n: Int

    init(_ arr: [Int]) {
        n = arr.count
        tree = [Int](repeating: 0, count: n + 1)
        for i in 0..<n {
            update(i, arr[i])
        }
    }

    func update(_ idx: Int, _ delta: Int) {
        var i = idx + 1
        while i <= n {
            tree[i] += delta
            i += i & (-i)
        }
    }

    func query(_ idx: Int) -> Int {
        var sum = 0
        var i = idx + 1
        while i > 0 {
            sum += tree[i]
            i -= i & (-i)
        }
        return sum
    }
}

let arr = [1, 2, 3, 4, 5]
let ft = FenwickTree(arr)
print("Sum of first 4 elements: \(ft.query(3))")

ft.update(2, 5)
print("After update, sum of first 4 elements: \(ft.query(3))")
