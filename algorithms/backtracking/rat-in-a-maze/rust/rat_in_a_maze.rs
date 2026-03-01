pub fn rat_in_maze(arr: &[i32]) -> i32 {
    let n = arr[0] as usize;
    let mut grid = vec![vec![0i32; n]; n];
    let mut idx = 1;
    for i in 0..n {
        for j in 0..n {
            grid[i][j] = arr[idx]; idx += 1;
        }
    }
    if grid[0][0] == 0 || grid[n-1][n-1] == 0 { return 0; }
    let mut visited = vec![vec![false; n]; n];

    fn solve(grid: &Vec<Vec<i32>>, visited: &mut Vec<Vec<bool>>, r: i32, c: i32, n: i32) -> bool {
        if r == n - 1 && c == n - 1 { return true; }
        if r < 0 || r >= n || c < 0 || c >= n { return false; }
        let (ru, cu) = (r as usize, c as usize);
        if grid[ru][cu] == 0 || visited[ru][cu] { return false; }
        visited[ru][cu] = true;
        if solve(grid, visited, r + 1, c, n) || solve(grid, visited, r, c + 1, n) { return true; }
        visited[ru][cu] = false;
        false
    }

    if solve(&grid, &mut visited, 0, 0, n as i32) { 1 } else { 0 }
}
