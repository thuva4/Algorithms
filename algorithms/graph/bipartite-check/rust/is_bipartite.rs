use std::collections::VecDeque;

pub fn is_bipartite(arr: &[i32]) -> i32 {
    let n = arr[0] as usize;
    let m = arr[1] as usize;
    let mut adj = vec![vec![]; n];
    for i in 0..m {
        let u = arr[2 + 2 * i] as usize;
        let v = arr[2 + 2 * i + 1] as usize;
        adj[u].push(v);
        adj[v].push(u);
    }

    let mut color = vec![-1i32; n];

    for start in 0..n {
        if color[start] != -1 { continue; }
        color[start] = 0;
        let mut queue = VecDeque::new();
        queue.push_back(start);
        while let Some(u) = queue.pop_front() {
            for &v in &adj[u] {
                if color[v] == -1 {
                    color[v] = 1 - color[u];
                    queue.push_back(v);
                } else if color[v] == color[u] {
                    return 0;
                }
            }
        }
    }

    1
}
