class SegmentTree {
    private var tree: [Int]
    private let n: Int

    init(_ arr: [Int]) {
        n = arr.count
        tree = [Int](repeating: 0, count: 4 * n)
        if n > 0 {
            build(arr, 0, 0, n - 1)
        }
    }

    private func build(_ arr: [Int], _ node: Int, _ start: Int, _ end: Int) {
        if start == end {
            tree[node] = arr[start]
        } else {
            let mid = (start + end) / 2
            build(arr, 2 * node + 1, start, mid)
            build(arr, 2 * node + 2, mid + 1, end)
            tree[node] = tree[2 * node + 1] + tree[2 * node + 2]
        }
    }

    func update(_ idx: Int, _ val: Int) {
        updateHelper(0, 0, n - 1, idx, val)
    }

    private func updateHelper(_ node: Int, _ start: Int, _ end: Int, _ idx: Int, _ val: Int) {
        if start == end {
            tree[node] = val
        } else {
            let mid = (start + end) / 2
            if idx <= mid {
                updateHelper(2 * node + 1, start, mid, idx, val)
            } else {
                updateHelper(2 * node + 2, mid + 1, end, idx, val)
            }
            tree[node] = tree[2 * node + 1] + tree[2 * node + 2]
        }
    }

    func query(_ l: Int, _ r: Int) -> Int {
        return queryHelper(0, 0, n - 1, l, r)
    }

    private func queryHelper(_ node: Int, _ start: Int, _ end: Int, _ l: Int, _ r: Int) -> Int {
        if r < start || end < l { return 0 }
        if l <= start && end <= r { return tree[node] }
        let mid = (start + end) / 2
        return queryHelper(2 * node + 1, start, mid, l, r) +
               queryHelper(2 * node + 2, mid + 1, end, l, r)
    }
}

let arr = [1, 3, 5, 7, 9, 11]
let st = SegmentTree(arr)
print("Sum [1, 3]: \(st.query(1, 3))")

st.update(1, 10)
print("After update, sum [1, 3]: \(st.query(1, 3))")
