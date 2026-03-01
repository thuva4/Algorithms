use std::cmp;

pub fn lcs(x: &str, y: &str) -> usize {
    let m = x.len();
    let n = y.len();
    let x_bytes = x.as_bytes();
    let y_bytes = y.as_bytes();

    let mut dp = vec![vec![0usize; n + 1]; m + 1];

    for i in 1..=m {
        for j in 1..=n {
            if x_bytes[i - 1] == y_bytes[j - 1] {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = cmp::max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    dp[m][n]
}

fn main() {
    println!("{}", lcs("ABCBDAB", "BDCAB")); // 4
}
