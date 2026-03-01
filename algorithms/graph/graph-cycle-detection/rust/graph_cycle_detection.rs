pub fn graph_cycle_detection(arr: &[i32]) -> i32 {
    let n = arr[0] as usize;
    let m = arr[1] as usize;
    let mut adj = vec![vec![]; n];
    for i in 0..m {
        let u = arr[2 + 2 * i] as usize;
        let v = arr[2 + 2 * i + 1] as usize;
        adj[u].push(v);
    }
    let mut color = vec![0u8; n];

    fn dfs(v: usize, adj: &[Vec<usize>], color: &mut [u8]) -> bool {
        color[v] = 1;
        for &w in &adj[v] {
            if color[w] == 1 { return true; }
            if color[w] == 0 && dfs(w, adj, color) { return true; }
        }
        color[v] = 2;
        false
    }

    for v in 0..n {
        if color[v] == 0 && dfs(v, &adj, &mut color) { return 1; }
    }
    0
}
