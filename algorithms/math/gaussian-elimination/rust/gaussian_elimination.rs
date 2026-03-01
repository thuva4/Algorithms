pub fn gaussian_elimination(arr: &[i32]) -> i32 {
    let mut idx = 0; let n = arr[idx] as usize; idx += 1;
    let mut mat = vec![vec![0.0f64; n+1]; n];
    for i in 0..n { for j in 0..=n { mat[i][j] = arr[idx] as f64; idx += 1; } }

    for col in 0..n {
        let mut max_row = col;
        for row in col+1..n { if mat[row][col].abs() > mat[max_row][col].abs() { max_row = row; } }
        mat.swap(col, max_row);
        for row in col+1..n {
            if mat[col][col] == 0.0 { continue; }
            let f = mat[row][col] / mat[col][col];
            for j in col..=n { mat[row][j] -= f * mat[col][j]; }
        }
    }

    let mut sol = vec![0.0f64; n];
    for i in (0..n).rev() {
        sol[i] = mat[i][n];
        for j in i+1..n { sol[i] -= mat[i][j] * sol[j]; }
        sol[i] /= mat[i][i];
    }

    sol.iter().sum::<f64>().round() as i32
}

fn main() {
    println!("{}", gaussian_elimination(&[2, 1, 1, 3, 2, 1, 4]));
    println!("{}", gaussian_elimination(&[2, 1, 0, 5, 0, 1, 3]));
    println!("{}", gaussian_elimination(&[1, 2, 6]));
    println!("{}", gaussian_elimination(&[3, 1, 1, 1, 6, 0, 2, 1, 5, 0, 0, 3, 9]));
}
