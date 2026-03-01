use std::cmp;

pub fn dungeon_game(grid: &Vec<Vec<i32>>) -> i32 {
    let m = grid.len();
    if m == 0 {
        return 0;
    }
    let n = grid[0].len();

    let mut dp = vec![vec![0i32; n]; m];

    for i in (0..m).rev() {
        for j in (0..n).rev() {
            if i == m - 1 && j == n - 1 {
                dp[i][j] = cmp::min(0, grid[i][j]);
            } else if i == m - 1 {
                dp[i][j] = cmp::min(0, grid[i][j] + dp[i][j + 1]);
            } else if j == n - 1 {
                dp[i][j] = cmp::min(0, grid[i][j] + dp[i + 1][j]);
            } else {
                dp[i][j] = cmp::min(0, grid[i][j] + cmp::max(dp[i][j + 1], dp[i + 1][j]));
            }
        }
    }

    dp[0][0].abs() + 1
}

fn main() {
    let grid = vec![
        vec![-2, -3, 3],
        vec![-5, -10, 1],
        vec![10, 30, -5],
    ];
    println!("{}", dungeon_game(&grid)); // 7
}
