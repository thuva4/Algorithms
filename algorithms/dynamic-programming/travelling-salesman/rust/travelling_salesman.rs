pub fn travelling_salesman(arr: &[i32]) -> i32 {
    let n = arr[0] as usize;
    if n <= 1 { return 0; }
    let mut dist = vec![vec![0i32; n]; n];
    for i in 0..n { for j in 0..n { dist[i][j] = arr[1 + i*n + j]; } }
    let inf = i32::MAX / 2;
    let full = (1usize << n) - 1;
    let mut dp = vec![vec![inf; n]; 1 << n];
    dp[1][0] = 0;
    for mask in 1..=full {
        for i in 0..n {
            if dp[mask][i] >= inf || mask & (1 << i) == 0 { continue; }
            for j in 0..n {
                if mask & (1 << j) != 0 { continue; }
                let nm = mask | (1 << j);
                let cost = dp[mask][i] + dist[i][j];
                if cost < dp[nm][j] { dp[nm][j] = cost; }
            }
        }
    }
    let mut result = inf;
    for i in 0..n {
        let v = dp[full][i] + dist[i][0];
        if v < result { result = v; }
    }
    result
}
