use std::collections::VecDeque;

/// Edmonds-Karp algorithm (BFS-based Ford-Fulkerson) for maximum flow.
fn edmonds_karp(capacity: &Vec<Vec<i32>>, source: usize, sink: usize) -> i32 {
    if source == sink {
        return 0;
    }

    let n = capacity.len();
    let mut residual: Vec<Vec<i32>> = capacity.clone();
    let mut total_flow = 0;

    loop {
        // BFS to find augmenting path
        let mut parent = vec![-1i32; n];
        let mut visited = vec![false; n];
        let mut queue = VecDeque::new();
        queue.push_back(source);
        visited[source] = true;

        while let Some(u) = queue.pop_front() {
            if visited[sink] {
                break;
            }
            for v in 0..n {
                if !visited[v] && residual[u][v] > 0 {
                    visited[v] = true;
                    parent[v] = u as i32;
                    queue.push_back(v);
                }
            }
        }

        if !visited[sink] {
            break;
        }

        // Find minimum capacity along path
        let mut path_flow = i32::MAX;
        let mut v = sink;
        while v != source {
            let u = parent[v] as usize;
            path_flow = path_flow.min(residual[u][v]);
            v = u;
        }

        // Update residual capacities
        v = sink;
        while v != source {
            let u = parent[v] as usize;
            residual[u][v] -= path_flow;
            residual[v][u] += path_flow;
            v = u;
        }

        total_flow += path_flow;
    }

    total_flow
}

fn main() {
    let capacity = vec![
        vec![0, 10, 10, 0, 0, 0],
        vec![0, 0, 2, 4, 8, 0],
        vec![0, 0, 0, 0, 9, 0],
        vec![0, 0, 0, 0, 0, 10],
        vec![0, 0, 0, 6, 0, 10],
        vec![0, 0, 0, 0, 0, 0],
    ];

    let result = edmonds_karp(&capacity, 0, 5);
    println!("Maximum flow: {}", result);
}
