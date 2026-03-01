use std::cmp;

const GAP_COST: i32 = 4;
const MISMATCH_COST: i32 = 3;

pub fn sequence_alignment(s1: &str, s2: &str) -> i32 {
    let m = s1.len();
    let n = s2.len();
    let s1_bytes = s1.as_bytes();
    let s2_bytes = s2.as_bytes();

    let mut dp = vec![vec![0i32; n + 1]; m + 1];

    for i in 0..=m {
        dp[i][0] = i as i32 * GAP_COST;
    }
    for j in 0..=n {
        dp[0][j] = j as i32 * GAP_COST;
    }

    for i in 1..=m {
        for j in 1..=n {
            let match_cost = if s1_bytes[i - 1] == s2_bytes[j - 1] { 0 } else { MISMATCH_COST };
            dp[i][j] = cmp::min(
                cmp::min(dp[i - 1][j] + GAP_COST, dp[i][j - 1] + GAP_COST),
                dp[i - 1][j - 1] + match_cost,
            );
        }
    }

    dp[m][n]
}

fn main() {
    println!("{}", sequence_alignment("GCCCTAGCG", "GCGCAATG")); // 18
}
