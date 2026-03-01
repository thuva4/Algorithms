use std::collections::VecDeque;
use std::i32;

pub fn hopcroft_karp(arr: &[i32]) -> i32 {
    if arr.len() < 3 {
        return 0;
    }

    let n_left = arr[0] as usize;
    let n_right = arr[1] as usize;
    let m = arr[2] as usize;

    if arr.len() < 3 + 2 * m {
        return 0;
    }
    if n_left == 0 || n_right == 0 {
        return 0;
    }

    let mut adj = vec![vec![]; n_left];
    for i in 0..m {
        let u = arr[3 + 2 * i] as usize;
        let v = arr[3 + 2 * i + 1] as usize;
        if u < n_left && v < n_right {
            adj[u].push(v);
        }
    }

    let mut pair_u = vec![-1; n_left];
    let mut pair_v = vec![-1; n_right];
    let mut dist = vec![0; n_left + 1];

    let mut matching = 0;

    loop {
        if !bfs(n_left, &adj, &pair_u, &pair_v, &mut dist) {
            break;
        }

        for u in 0..n_left {
            if pair_u[u] == -1 {
                if dfs(u as i32, &adj, &mut pair_u, &mut pair_v, &mut dist) {
                    matching += 1;
                }
            }
        }
    }

    matching
}

fn bfs(n_left: usize, adj: &Vec<Vec<usize>>, pair_u: &Vec<i32>, pair_v: &Vec<i32>, dist: &mut Vec<i32>) -> bool {
    let mut q = VecDeque::new();
    for u in 0..n_left {
        if pair_u[u] == -1 {
            dist[u] = 0;
            q.push_back(u);
        } else {
            dist[u] = i32::MAX;
        }
    }

    dist[n_left] = i32::MAX;

    while let Some(u) = q.pop_front() {
        if dist[u] < dist[n_left] {
            for &v in &adj[u] {
                let pu = pair_v[v];
                if pu == -1 {
                    if dist[n_left] == i32::MAX {
                        dist[n_left] = dist[u] + 1;
                    }
                } else if dist[pu as usize] == i32::MAX {
                    dist[pu as usize] = dist[u] + 1;
                    q.push_back(pu as usize);
                }
            }
        }
    }

    dist[n_left] != i32::MAX
}

fn dfs(u: i32, adj: &Vec<Vec<usize>>, pair_u: &mut Vec<i32>, pair_v: &mut Vec<i32>, dist: &mut Vec<i32>) -> bool {
    if u != -1 {
        let u_usize = u as usize;
        for &v in &adj[u_usize] {
            let pu = pair_v[v];
            if pu == -1 || (dist[pu as usize] == dist[u_usize] + 1 && dfs(pu, adj, pair_u, pair_v, dist)) {
                pair_v[v] = u;
                pair_u[u_usize] = v as i32;
                return true;
            }
        }
        dist[u_usize] = i32::MAX;
        return false;
    }
    true
}
