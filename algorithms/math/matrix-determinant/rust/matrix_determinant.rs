pub fn matrix_determinant(arr: &[i32]) -> i32 {
    let mut idx = 0;
    let n = arr[idx] as usize;
    idx += 1;
    let mut mat: Vec<Vec<f64>> = Vec::with_capacity(n);
    for _ in 0..n {
        let mut row = Vec::with_capacity(n);
        for _ in 0..n {
            row.push(arr[idx] as f64);
            idx += 1;
        }
        mat.push(row);
    }

    let mut det = 1.0_f64;
    for col in 0..n {
        let mut max_row = col;
        for row in (col + 1)..n {
            if mat[row][col].abs() > mat[max_row][col].abs() {
                max_row = row;
            }
        }
        if max_row != col {
            mat.swap(col, max_row);
            det *= -1.0;
        }
        if mat[col][col] == 0.0 {
            return 0;
        }
        det *= mat[col][col];
        for row in (col + 1)..n {
            let factor = mat[row][col] / mat[col][col];
            for j in (col + 1)..n {
                mat[row][j] -= factor * mat[col][j];
            }
        }
    }
    det.round() as i32
}

fn main() {
    println!("{}", matrix_determinant(&[2, 1, 2, 3, 4]));
    println!("{}", matrix_determinant(&[2, 1, 0, 0, 1]));
    println!("{}", matrix_determinant(&[3, 6, 1, 1, 4, -2, 5, 2, 8, 7]));
    println!("{}", matrix_determinant(&[1, 5]));
}
