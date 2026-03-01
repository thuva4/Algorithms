use std::collections::VecDeque;

pub fn bidirectional_bfs(arr: &[i32]) -> i32 {
    if arr.len() < 4 {
        return -1;
    }

    let n = arr[0] as usize;
    let m = arr[1] as usize;
    let start = arr[2] as usize;
    let end = arr[3] as usize;

    if arr.len() < 4 + 2 * m {
        return -1;
    }
    if start == end {
        return 0;
    }

    let mut adj = vec![vec![]; n];
    for i in 0..m {
        let u = arr[4 + 2 * i] as usize;
        let v = arr[4 + 2 * i + 1] as usize;
        if u < n && v < n {
            adj[u].push(v);
            adj[v].push(u);
        }
    }

    let mut dist_start = vec![-1; n];
    let mut dist_end = vec![-1; n];

    let mut q_start = VecDeque::new();
    let mut q_end = VecDeque::new();

    q_start.push_back(start);
    dist_start[start] = 0;

    q_end.push_back(end);
    dist_end[end] = 0;

    while !q_start.is_empty() && !q_end.is_empty() {
        if let Some(u) = q_start.pop_front() {
            if dist_end[u] != -1 {
                return dist_start[u] + dist_end[u];
            }

            for &v in &adj[u] {
                if dist_start[v] == -1 {
                    dist_start[v] = dist_start[u] + 1;
                    if dist_end[v] != -1 {
                        return dist_start[v] + dist_end[v];
                    }
                    q_start.push_back(v);
                }
            }
        }

        if let Some(u) = q_end.pop_front() {
            if dist_start[u] != -1 {
                return dist_start[u] + dist_end[u];
            }

            for &v in &adj[u] {
                if dist_end[v] == -1 {
                    dist_end[v] = dist_end[u] + 1;
                    if dist_start[v] != -1 {
                        return dist_start[v] + dist_end[v];
                    }
                    q_end.push_back(v);
                }
            }
        }
    }

    -1
}
