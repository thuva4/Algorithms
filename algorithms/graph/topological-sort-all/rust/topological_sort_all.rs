pub fn topological_sort_all(arr: &[i32]) -> i32 {
    let n = arr[0] as usize;
    let m = arr[1] as usize;
    let mut adj = vec![vec![]; n];
    let mut in_deg = vec![0i32; n];
    for i in 0..m {
        let u = arr[2 + 2 * i] as usize;
        let v = arr[2 + 2 * i + 1] as usize;
        adj[u].push(v);
        in_deg[v] += 1;
    }
    let mut visited = vec![false; n];
    let mut count = 0i32;

    fn backtrack(
        placed: usize, n: usize, adj: &[Vec<usize>], in_deg: &mut [i32],
        visited: &mut [bool], count: &mut i32,
    ) {
        if placed == n { *count += 1; return; }
        for v in 0..n {
            if !visited[v] && in_deg[v] == 0 {
                visited[v] = true;
                for &w in &adj[v] { in_deg[w] -= 1; }
                backtrack(placed + 1, n, adj, in_deg, visited, count);
                visited[v] = false;
                for &w in &adj[v] { in_deg[w] += 1; }
            }
        }
    }

    backtrack(0, n, &adj, &mut in_deg, &mut visited, &mut count);
    count
}
