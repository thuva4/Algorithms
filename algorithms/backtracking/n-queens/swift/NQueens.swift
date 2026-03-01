func nQueens(_ n: Int) -> Int {
    if n <= 0 {
        return 0
    }

    var cols = Set<Int>()
    var diags = Set<Int>()
    var antiDiags = Set<Int>()
    var count = 0

    func backtrack(_ row: Int) {
        if row == n {
            count += 1
            return
        }
        for col in 0..<n {
            if cols.contains(col) || diags.contains(row - col) || antiDiags.contains(row + col) {
                continue
            }
            cols.insert(col)
            diags.insert(row - col)
            antiDiags.insert(row + col)
            backtrack(row + 1)
            cols.remove(col)
            diags.remove(row - col)
            antiDiags.remove(row + col)
        }
    }

    backtrack(0)
    return count
}
