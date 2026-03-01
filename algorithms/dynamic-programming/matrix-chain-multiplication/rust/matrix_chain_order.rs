use std::cmp;

/// Given a sequence of matrix dimensions, find the minimum number
/// of scalar multiplications needed to compute the chain product.
///
/// dims: slice where matrix i has dimensions dims[i-1] x dims[i]
/// Returns: minimum number of scalar multiplications
pub fn matrix_chain_order(dims: &[i32]) -> i32 {
    let n = dims.len() as i32 - 1; // number of matrices

    if n <= 0 {
        return 0;
    }

    let n = n as usize;
    let mut m = vec![vec![0i64; n]; n];

    for chain_len in 2..=n {
        for i in 0..n - chain_len + 1 {
            let j = i + chain_len - 1;
            m[i][j] = i64::MAX;
            for k in i..j {
                let cost = m[i][k] + m[k + 1][j]
                    + (dims[i] as i64) * (dims[k + 1] as i64) * (dims[j + 1] as i64);
                if cost < m[i][j] {
                    m[i][j] = cost;
                }
            }
        }
    }

    m[0][n - 1] as i32
}

fn main() {
    println!("{}", matrix_chain_order(&[10, 20, 30]));              // 6000
    println!("{}", matrix_chain_order(&[40, 20, 30, 10, 30]));      // 26000
    println!("{}", matrix_chain_order(&[10, 20, 30, 40, 30]));      // 30000
    println!("{}", matrix_chain_order(&[1, 2, 3, 4]));              // 18
    println!("{}", matrix_chain_order(&[5, 10, 3, 12, 5, 50, 6]));  // 2010
}
