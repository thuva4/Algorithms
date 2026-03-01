use std::collections::VecDeque;

pub fn bfs(arr: &[i32]) -> Vec<i32> {
    if arr.len() < 2 {
        return Vec::new();
    }

    let n = arr[0] as usize;
    let m = arr[1] as usize;

    if arr.len() < 2 + 2 * m + 1 {
        return Vec::new();
    }

    let start = arr[2 + 2 * m] as usize;
    if start >= n {
        return Vec::new();
    }

    let mut adj = vec![vec![]; n];
    for i in 0..m {
        let u = arr[2 + 2 * i] as usize;
        let v = arr[2 + 2 * i + 1] as usize;
        if u < n && v < n {
            adj[u].push(v);
            adj[v].push(u);
        }
    }

    for i in 0..n {
        adj[i].sort();
    }

    let mut result = Vec::new();
    let mut visited = vec![false; n];
    let mut q = VecDeque::new();

    visited[start] = true;
    q.push_back(start);

    while let Some(u) = q.pop_front() {
        result.push(u as i32);

        for &v in &adj[u] {
            let v_usize = v;
            if !visited[v_usize] {
                visited[v_usize] = true;
                q.push_back(v_usize);
            }
        }
    }

    result
}
