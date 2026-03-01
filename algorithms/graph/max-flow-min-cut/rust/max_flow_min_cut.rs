use std::collections::VecDeque;

pub fn max_flow_min_cut(arr: &[i32]) -> i32 {
    let n = arr[0] as usize;
    let m = arr[1] as usize;
    let src = arr[2] as usize;
    let sink = arr[3] as usize;
    let mut cap = vec![vec![0i32; n]; n];
    for i in 0..m { cap[arr[4+3*i] as usize][arr[5+3*i] as usize] += arr[6+3*i]; }
    let mut max_flow = 0;
    loop {
        let mut parent = vec![-1i32; n];
        parent[src] = src as i32;
        let mut q = VecDeque::new();
        q.push_back(src);
        while let Some(u) = q.pop_front() {
            if parent[sink] != -1 { break; }
            for v in 0..n {
                if parent[v] == -1 && cap[u][v] > 0 { parent[v] = u as i32; q.push_back(v); }
            }
        }
        if parent[sink] == -1 { break; }
        let mut flow = i32::MAX;
        let mut v = sink;
        while v != src { let u = parent[v] as usize; flow = flow.min(cap[u][v]); v = u; }
        v = sink;
        while v != src { let u = parent[v] as usize; cap[u][v] -= flow; cap[v][u] += flow; v = u; }
        max_flow += flow;
    }
    max_flow
}
