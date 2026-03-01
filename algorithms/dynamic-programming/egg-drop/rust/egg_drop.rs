pub fn egg_drop(arr: &[i32]) -> i32 {
    let eggs = arr[0] as usize;
    let floors = arr[1] as usize;
    let mut dp = vec![vec![0i32; floors + 1]; eggs + 1];
    for f in 1..=floors { dp[1][f] = f as i32; }
    for e in 2..=eggs {
        for f in 1..=floors {
            dp[e][f] = i32::MAX;
            for x in 1..=f {
                let worst = 1 + dp[e - 1][x - 1].max(dp[e][f - x]);
                dp[e][f] = dp[e][f].min(worst);
            }
        }
    }
    dp[eggs][floors]
}
