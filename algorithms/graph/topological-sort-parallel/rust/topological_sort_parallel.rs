use std::collections::VecDeque;

pub fn topological_sort_parallel(data: &[i32]) -> i32 {
    let n = data[0] as usize;
    let m = data[1] as usize;

    let mut adj = vec![vec![]; n];
    let mut indegree = vec![0i32; n];

    let mut idx = 2;
    for _ in 0..m {
        let u = data[idx] as usize;
        let v = data[idx + 1] as usize;
        adj[u].push(v);
        indegree[v] += 1;
        idx += 2;
    }

    let mut queue: VecDeque<usize> = VecDeque::new();
    for i in 0..n {
        if indegree[i] == 0 {
            queue.push_back(i);
        }
    }

    let mut rounds = 0;
    let mut processed = 0;

    while !queue.is_empty() {
        let size = queue.len();
        for _ in 0..size {
            let node = queue.pop_front().unwrap();
            processed += 1;
            for &neighbor in &adj[node] {
                indegree[neighbor] -= 1;
                if indegree[neighbor] == 0 {
                    queue.push_back(neighbor);
                }
            }
        }
        rounds += 1;
    }

    if processed == n as i32 { rounds } else { -1 }
}
