use std::collections::VecDeque;

pub fn spfa(arr: &[i32]) -> i32 {
    let n = arr[0] as usize;
    let m = arr[1] as usize;
    let src = arr[2] as usize;
    let mut adj: Vec<Vec<(usize, i32)>> = vec![vec![]; n];
    for i in 0..m {
        let u = arr[3 + 3 * i] as usize;
        let v = arr[3 + 3 * i + 1] as usize;
        let w = arr[3 + 3 * i + 2];
        adj[u].push((v, w));
    }

    let inf = i32::MAX / 2;
    let mut dist = vec![inf; n];
    dist[src] = 0;
    let mut in_queue = vec![false; n];
    let mut queue = VecDeque::new();
    queue.push_back(src);
    in_queue[src] = true;

    while let Some(u) = queue.pop_front() {
        in_queue[u] = false;
        for &(v, w) in &adj[u] {
            if dist[u] + w < dist[v] {
                dist[v] = dist[u] + w;
                if !in_queue[v] {
                    queue.push_back(v);
                    in_queue[v] = true;
                }
            }
        }
    }

    if dist[n - 1] == inf { -1 } else { dist[n - 1] }
}
