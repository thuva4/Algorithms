pub fn hamiltonian_path(arr: &[i32]) -> i32 {
    let n = arr[0] as usize;
    let m = arr[1] as usize;
    if n <= 1 { return 1; }
    let mut adj = vec![vec![false; n]; n];
    for i in 0..m {
        let u = arr[2+2*i] as usize;
        let v = arr[3+2*i] as usize;
        adj[u][v] = true; adj[v][u] = true;
    }
    let full = (1usize << n) - 1;
    let mut dp = vec![vec![false; n]; 1 << n];
    for i in 0..n { dp[1 << i][i] = true; }
    for mask in 1..=full {
        for i in 0..n {
            if !dp[mask][i] { continue; }
            for j in 0..n {
                if mask & (1 << j) == 0 && adj[i][j] {
                    dp[mask | (1 << j)][j] = true;
                }
            }
        }
    }
    for i in 0..n { if dp[full][i] { return 1; } }
    0
}
