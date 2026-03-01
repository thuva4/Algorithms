fn dfs_ff(u: usize, sink: usize, flow: i32, visited: &mut Vec<bool>, cap: &mut Vec<Vec<i32>>, n: usize) -> i32 {
    if u == sink { return flow; }
    visited[u] = true;
    for v in 0..n {
        if !visited[v] && cap[u][v] > 0 {
            let d = dfs_ff(v, sink, flow.min(cap[u][v]), visited, cap, n);
            if d > 0 { cap[u][v] -= d; cap[v][u] += d; return d; }
        }
    }
    0
}

pub fn ford_fulkerson(arr: &[i32]) -> i32 {
    let n = arr[0] as usize; let m = arr[1] as usize;
    let src = arr[2] as usize; let sink = arr[3] as usize;
    let mut cap = vec![vec![0i32; n]; n];
    for i in 0..m { cap[arr[4+3*i] as usize][arr[5+3*i] as usize] += arr[6+3*i]; }
    let mut max_flow = 0;
    loop {
        let mut visited = vec![false; n];
        let flow = dfs_ff(src, sink, i32::MAX, &mut visited, &mut cap, n);
        if flow == 0 { break; }
        max_flow += flow;
    }
    max_flow
}
