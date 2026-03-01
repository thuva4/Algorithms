/// Flood fill algorithm using DFS.
/// Fills all connected cells with the same value as (sr, sc) with new_value.
fn flood_fill(grid: &mut Vec<Vec<i32>>, sr: usize, sc: usize, new_value: i32) {
    let original_value = grid[sr][sc];
    if original_value == new_value {
        return;
    }

    let rows = grid.len();
    let cols = grid[0].len();

    fn dfs(grid: &mut Vec<Vec<i32>>, r: i32, c: i32, rows: i32, cols: i32, original: i32, new_val: i32) {
        if r < 0 || r >= rows || c < 0 || c >= cols {
            return;
        }
        let ru = r as usize;
        let cu = c as usize;
        if grid[ru][cu] != original {
            return;
        }
        grid[ru][cu] = new_val;
        dfs(grid, r - 1, c, rows, cols, original, new_val);
        dfs(grid, r + 1, c, rows, cols, original, new_val);
        dfs(grid, r, c - 1, rows, cols, original, new_val);
        dfs(grid, r, c + 1, rows, cols, original, new_val);
    }

    dfs(grid, sr as i32, sc as i32, rows as i32, cols as i32, original_value, new_value);
}

fn main() {
    let mut grid = vec![
        vec![1, 1, 1],
        vec![1, 1, 0],
        vec![1, 0, 1],
    ];

    flood_fill(&mut grid, 0, 0, 2);

    println!("After flood fill:");
    for row in &grid {
        println!("{:?}", row);
    }
}
