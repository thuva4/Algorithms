use std::collections::VecDeque;

pub fn connected_components(arr: &[i32]) -> Vec<i32> {
    if arr.len() < 2 {
        return Vec::new();
    }

    let n = arr[0] as usize;
    let m = arr[1] as usize;

    if arr.len() < 2 + 2 * m {
        return Vec::new();
    }
    if n == 0 {
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

    let mut labels = vec![-1; n];
    let mut q = VecDeque::new();

    for i in 0..n {
        if labels[i] == -1 {
            let component_id = i as i32;
            labels[i] = component_id;
            q.push_back(i);

            while let Some(u) = q.pop_front() {
                for &v in &adj[u] {
                    if labels[v] == -1 {
                        labels[v] = component_id;
                        q.push_back(v);
                    }
                }
            }
        }
    }

    labels
}
