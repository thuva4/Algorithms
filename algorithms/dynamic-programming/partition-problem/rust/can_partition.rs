pub fn can_partition(arr: &[i32]) -> i32 {
    let total: i32 = arr.iter().sum();
    if total % 2 != 0 { return 0; }
    let target = (total / 2) as usize;
    let mut dp = vec![false; target + 1];
    dp[0] = true;
    for &num in arr {
        let num = num as usize;
        for j in (num..=target).rev() {
            dp[j] = dp[j] || dp[j - num];
        }
    }
    if dp[target] { 1 } else { 0 }
}
