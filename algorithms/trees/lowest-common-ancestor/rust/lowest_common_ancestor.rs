pub fn lowest_common_ancestor(arr: &[i32]) -> i32 {
    let mut idx = 0;
    let n = arr[idx] as usize; idx += 1;
    let root = arr[idx] as usize; idx += 1;

    let mut adj: Vec<Vec<usize>> = vec![vec![]; n];
    for _ in 0..n-1 {
        let u = arr[idx] as usize; idx += 1;
        let v = arr[idx] as usize; idx += 1;
        adj[u].push(v); adj[v].push(u);
    }
    let qa = arr[idx] as usize; idx += 1;
    let qb = arr[idx] as usize;

    let mut log = 1;
    while (1 << log) < n { log += 1; }

    let mut depth = vec![0usize; n];
    let mut up = vec![vec![0usize; n]; log];

    let mut visited = vec![false; n];
    visited[root] = true;
    up[0][root] = root;
    let mut queue = std::collections::VecDeque::new();
    queue.push_back(root);
    while let Some(v) = queue.pop_front() {
        for i in 0..adj[v].len() {
            let u = adj[v][i];
            if !visited[u] {
                visited[u] = true;
                depth[u] = depth[v] + 1;
                up[0][u] = v;
                queue.push_back(u);
            }
        }
    }

    for k in 1..log {
        for v in 0..n {
            up[k][v] = up[k-1][up[k-1][v]];
        }
    }

    let mut a = qa;
    let mut b = qb;
    if depth[a] < depth[b] { std::mem::swap(&mut a, &mut b); }
    let diff = depth[a] - depth[b];
    for k in 0..log {
        if (diff >> k) & 1 == 1 { a = up[k][a]; }
    }
    if a == b { return a as i32; }
    for k in (0..log).rev() {
        if up[k][a] != up[k][b] { a = up[k][a]; b = up[k][b]; }
    }
    up[0][a] as i32
}

fn main() {
    println!("{}", lowest_common_ancestor(&[5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 3, 2]));
    println!("{}", lowest_common_ancestor(&[5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 1, 3]));
    println!("{}", lowest_common_ancestor(&[3, 0, 0, 1, 0, 2, 2, 2]));
    println!("{}", lowest_common_ancestor(&[5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 3, 4]));
}
