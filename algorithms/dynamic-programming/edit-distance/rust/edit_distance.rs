use std::cmp;

pub fn edit_distance(s1: &str, s2: &str) -> usize {
    let m = s1.len();
    let n = s2.len();
    let s1_bytes = s1.as_bytes();
    let s2_bytes = s2.as_bytes();

    let mut dp = vec![vec![0usize; n + 1]; m + 1];

    for i in 0..=m {
        dp[i][0] = i;
    }
    for j in 0..=n {
        dp[0][j] = j;
    }

    for i in 1..=m {
        for j in 1..=n {
            let cost = if s1_bytes[i - 1] != s2_bytes[j - 1] { 1 } else { 0 };
            dp[i][j] = cmp::min(
                cmp::min(dp[i - 1][j] + 1, dp[i][j - 1] + 1),
                dp[i - 1][j - 1] + cost,
            );
        }
    }

    dp[m][n]
}

fn main() {
    println!("{}", edit_distance("kitten", "sitting")); // 3
}
