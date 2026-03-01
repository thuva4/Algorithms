pub fn chromatic_number(arr: &[i32]) -> i32 {
    if arr.len() < 2 {
        return 0;
    }
    let n = arr[0] as usize;
    let m = arr[1] as usize;

    if arr.len() < 2 + 2 * m {
        return 0;
    }
    if n == 0 {
        return 0;
    }

    let mut adj = vec![vec![false; n]; n];
    for i in 0..m {
        let u = arr[2 + 2 * i] as usize;
        let v = arr[2 + 2 * i + 1] as usize;
        if u < n && v < n {
            adj[u][v] = true;
            adj[v][u] = true;
        }
    }

    let mut color = vec![0; n];

    for k in 1..=n {
        if graph_coloring_util(0, n, k as i32, &mut color, &adj) {
            return k as i32;
        }
    }

    n as i32
}

fn is_safe(u: usize, c: i32, n: usize, color: &[i32], adj: &Vec<Vec<bool>>) -> bool {
    for v in 0..n {
        if adj[u][v] && color[v] == c {
            return false;
        }
    }
    true
}

fn graph_coloring_util(u: usize, n: usize, k: i32, color: &mut Vec<i32>, adj: &Vec<Vec<bool>>) -> bool {
    if u == n {
        return true;
    }

    for c in 1..=k {
        if is_safe(u, c, n, color, adj) {
            color[u] = c;
            if graph_coloring_util(u + 1, n, k, color, adj) {
                return true;
            }
            color[u] = 0;
        }
    }
    false
}
