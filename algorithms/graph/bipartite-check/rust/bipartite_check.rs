use std::collections::VecDeque;

pub fn is_bipartite(arr: &[i32]) -> i32 {
    if arr.len() < 2 {
        return 0;
    }

    let n = arr[0] as usize;
    let m = arr[1] as usize;

    if arr.len() < 2 + 2 * m {
        return 0;
    }
    if n == 0 {
        return 1;
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

    let mut color = vec![0; n]; // 0: none, 1: red, -1: blue
    let mut q = VecDeque::new();

    for i in 0..n {
        if color[i] == 0 {
            color[i] = 1;
            q.push_back(i);

            while let Some(u) = q.pop_front() {
                for &v in &adj[u] {
                    if color[v] == 0 {
                        color[v] = -color[u];
                        q.push_back(v);
                    } else if color[v] == color[u] {
                        return 0;
                    }
                }
            }
        }
    }

    1
}
