pub fn longest_palindromic_subsequence(arr: &[i32]) -> i32 {
    let n = arr.len();
    if n == 0 { return 0; }
    let mut dp = vec![vec![0i32; n]; n];
    for i in 0..n { dp[i][i] = 1; }
    for len in 2..=n {
        for i in 0..=n-len {
            let j = i + len - 1;
            if arr[i] == arr[j] { dp[i][j] = if len == 2 { 2 } else { dp[i+1][j-1] + 2 }; }
            else { dp[i][j] = dp[i+1][j].max(dp[i][j-1]); }
        }
    }
    dp[0][n-1]
}
