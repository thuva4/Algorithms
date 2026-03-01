pub fn maximum_bipartite_matching(arr: &[i32]) -> i32 {
    let n_left = arr[0] as usize;
    let n_right = arr[1] as usize;
    let m = arr[2] as usize;
    let mut adj = vec![vec![]; n_left];
    for i in 0..m {
        let u = arr[3 + 2 * i] as usize;
        let v = arr[3 + 2 * i + 1] as usize;
        adj[u].push(v);
    }
    let mut match_right = vec![-1i32; n_right];

    fn dfs(u: usize, adj: &[Vec<usize>], match_right: &mut [i32], visited: &mut [bool]) -> bool {
        for &v in &adj[u] {
            if !visited[v] {
                visited[v] = true;
                if match_right[v] == -1 || dfs(match_right[v] as usize, adj, match_right, visited) {
                    match_right[v] = u as i32;
                    return true;
                }
            }
        }
        false
    }

    let mut result = 0i32;
    for u in 0..n_left {
        let mut visited = vec![false; n_right];
        if dfs(u, &adj, &mut match_right, &mut visited) { result += 1; }
    }
    result
}
