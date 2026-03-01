pub fn euler_path(arr: &[i32]) -> i32 {
    let n = arr[0] as usize;
    let m = arr[1] as usize;
    if n == 0 { return 1; }
    let mut adj = vec![vec![]; n];
    let mut degree = vec![0usize; n];
    for i in 0..m {
        let u = arr[2+2*i] as usize;
        let v = arr[3+2*i] as usize;
        adj[u].push(v); adj[v].push(u);
        degree[u] += 1; degree[v] += 1;
    }
    for &d in &degree { if d % 2 != 0 { return 0; } }
    let mut start = None;
    for i in 0..n { if degree[i] > 0 { start = Some(i); break; } }
    let start = match start { Some(s) => s, None => return 1 };
    let mut visited = vec![false; n];
    let mut stack = vec![start];
    visited[start] = true;
    while let Some(v) = stack.pop() {
        for &u in &adj[v] { if !visited[u] { visited[u] = true; stack.push(u); } }
    }
    for i in 0..n { if degree[i] > 0 && !visited[i] { return 0; } }
    1
}
