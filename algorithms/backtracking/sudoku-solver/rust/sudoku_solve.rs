pub fn sudoku_solve(board: &[i32]) -> Vec<i32> {
    let mut grid: Vec<i32> = board.to_vec();
    if solve(&mut grid) {
        grid
    } else {
        Vec::new()
    }
}

fn is_valid(grid: &[i32], pos: usize, num: i32) -> bool {
    let row = pos / 9;
    let col = pos % 9;

    // Check row
    for c in 0..9 {
        if grid[row * 9 + c] == num {
            return false;
        }
    }

    // Check column
    for r in 0..9 {
        if grid[r * 9 + col] == num {
            return false;
        }
    }

    // Check 3x3 box
    let box_row = 3 * (row / 3);
    let box_col = 3 * (col / 3);
    for r in box_row..box_row + 3 {
        for c in box_col..box_col + 3 {
            if grid[r * 9 + c] == num {
                return false;
            }
        }
    }

    true
}

fn solve(grid: &mut Vec<i32>) -> bool {
    for i in 0..81 {
        if grid[i] == 0 {
            for num in 1..=9 {
                if is_valid(grid, i, num) {
                    grid[i] = num;
                    if solve(grid) {
                        return true;
                    }
                    grid[i] = 0;
                }
            }
            return false;
        }
    }
    true
}
