/// Find shortest path from source to vertex n-1 in a DAG.
///
/// Input format: [n, m, src, u1, v1, w1, ...]
///
/// # Returns
/// Shortest distance from src to n-1, or -1 if unreachable
pub fn shortest_path_dag(arr: &[i32]) -> i32 {
    let mut idx = 0;
    let n = arr[idx] as usize; idx += 1;
    let m = arr[idx] as usize; idx += 1;
    let src = arr[idx] as usize; idx += 1;

    let mut adj: Vec<Vec<(usize, i32)>> = vec![vec![]; n];
    let mut in_degree = vec![0usize; n];
    for _ in 0..m {
        let u = arr[idx] as usize; idx += 1;
        let v = arr[idx] as usize; idx += 1;
        let w = arr[idx]; idx += 1;
        adj[u].push((v, w));
        in_degree[v] += 1;
    }

    let mut queue = std::collections::VecDeque::new();
    for i in 0..n {
        if in_degree[i] == 0 { queue.push_back(i); }
    }

    let mut topo_order = Vec::new();
    while let Some(node) = queue.pop_front() {
        topo_order.push(node);
        for &(v, _) in &adj[node] {
            in_degree[v] -= 1;
            if in_degree[v] == 0 { queue.push_back(v); }
        }
    }

    let inf = i32::MAX;
    let mut dist = vec![inf; n];
    dist[src] = 0;

    for &u in &topo_order {
        if dist[u] == inf { continue; }
        for &(v, w) in &adj[u] {
            if dist[u] + w < dist[v] { dist[v] = dist[u] + w; }
        }
    }

    if dist[n - 1] == inf { -1 } else { dist[n - 1] }
}

fn main() {
    println!("{}", shortest_path_dag(&[4, 4, 0, 0, 1, 2, 0, 2, 4, 1, 2, 1, 1, 3, 7]));
    println!("{}", shortest_path_dag(&[3, 3, 0, 0, 1, 5, 0, 2, 3, 1, 2, 1]));
    println!("{}", shortest_path_dag(&[2, 1, 0, 0, 1, 10]));
    println!("{}", shortest_path_dag(&[3, 1, 0, 1, 2, 5]));
}
