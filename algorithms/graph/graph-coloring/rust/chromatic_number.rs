pub fn chromatic_number(arr: &[i32]) -> i32 {
    let n = arr[0] as usize;
    let m = arr[1] as usize;
    if n == 0 { return 0; }
    if m == 0 { return 1; }

    let mut adj = vec![vec![]; n];
    for i in 0..m {
        let u = arr[2 + 2 * i] as usize;
        let v = arr[2 + 2 * i + 1] as usize;
        adj[u].push(v);
        adj[v].push(u);
    }

    fn is_safe(adj: &Vec<Vec<usize>>, colors: &Vec<i32>, v: usize, c: i32) -> bool {
        for &u in &adj[v] {
            if colors[u] == c { return false; }
        }
        true
    }

    fn solve(adj: &Vec<Vec<usize>>, colors: &mut Vec<i32>, v: usize, n: usize, k: i32) -> bool {
        if v == n { return true; }
        for c in 1..=k {
            if is_safe(adj, colors, v, c) {
                colors[v] = c;
                if solve(adj, colors, v + 1, n, k) { return true; }
                colors[v] = 0;
            }
        }
        false
    }

    for k in 1..=(n as i32) {
        let mut colors = vec![0i32; n];
        if solve(&adj, &mut colors, 0, n, k) { return k; }
    }
    n as i32
}
