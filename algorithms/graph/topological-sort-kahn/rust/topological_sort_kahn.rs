use std::collections::VecDeque;

pub fn topological_sort_kahn(arr: &[i32]) -> Vec<i32> {
    if arr.len() < 2 {
        return vec![];
    }

    let num_vertices = arr[0] as usize;
    let num_edges = arr[1] as usize;

    let mut adj: Vec<Vec<usize>> = vec![vec![]; num_vertices];
    let mut in_degree = vec![0usize; num_vertices];

    for i in 0..num_edges {
        let u = arr[2 + 2 * i] as usize;
        let v = arr[2 + 2 * i + 1] as usize;
        adj[u].push(v);
        in_degree[v] += 1;
    }

    let mut queue = VecDeque::new();
    for v in 0..num_vertices {
        if in_degree[v] == 0 {
            queue.push_back(v);
        }
    }

    let mut result = Vec::new();
    while let Some(u) = queue.pop_front() {
        result.push(u as i32);
        for &v in &adj[u] {
            in_degree[v] -= 1;
            if in_degree[v] == 0 {
                queue.push_back(v);
            }
        }
    }

    if result.len() == num_vertices {
        result
    } else {
        vec![]
    }
}
