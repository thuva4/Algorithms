use std::collections::HashSet;

pub fn n_queens(n: i32) -> i32 {
    if n <= 0 {
        return 0;
    }
    let mut cols = HashSet::new();
    let mut diags = HashSet::new();
    let mut anti_diags = HashSet::new();
    let mut count = 0;
    backtrack(0, n, &mut cols, &mut diags, &mut anti_diags, &mut count);
    count
}

fn backtrack(
    row: i32,
    n: i32,
    cols: &mut HashSet<i32>,
    diags: &mut HashSet<i32>,
    anti_diags: &mut HashSet<i32>,
    count: &mut i32,
) {
    if row == n {
        *count += 1;
        return;
    }
    for col in 0..n {
        if cols.contains(&col) || diags.contains(&(row - col)) || anti_diags.contains(&(row + col))
        {
            continue;
        }
        cols.insert(col);
        diags.insert(row - col);
        anti_diags.insert(row + col);
        backtrack(row + 1, n, cols, diags, anti_diags, count);
        cols.remove(&col);
        diags.remove(&(row - col));
        anti_diags.remove(&(row + col));
    }
}
