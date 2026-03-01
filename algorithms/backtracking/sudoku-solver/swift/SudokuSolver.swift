func sudokuSolve(_ board: [Int]) -> [Int] {
    var grid = board

    func isValid(_ pos: Int, _ num: Int) -> Bool {
        let row = pos / 9
        let col = pos % 9

        // Check row
        for c in 0..<9 {
            if grid[row * 9 + c] == num { return false }
        }

        // Check column
        for r in 0..<9 {
            if grid[r * 9 + col] == num { return false }
        }

        // Check 3x3 box
        let boxRow = 3 * (row / 3)
        let boxCol = 3 * (col / 3)
        for r in boxRow..<boxRow + 3 {
            for c in boxCol..<boxCol + 3 {
                if grid[r * 9 + c] == num { return false }
            }
        }

        return true
    }

    func solve() -> Bool {
        for i in 0..<81 {
            if grid[i] == 0 {
                for num in 1...9 {
                    if isValid(i, num) {
                        grid[i] = num
                        if solve() { return true }
                        grid[i] = 0
                    }
                }
                return false
            }
        }
        return true
    }

    if solve() {
        return grid
    }
    return []
}
