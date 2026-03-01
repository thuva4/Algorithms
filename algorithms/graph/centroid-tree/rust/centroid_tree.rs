use std::cmp::max;

struct CentroidContext {
    adj: Vec<Vec<usize>>,
    sz: Vec<usize>,
    removed: Vec<bool>,
    max_depth: usize,
}

impl CentroidContext {
    fn new(n: usize) -> Self {
        CentroidContext {
            adj: vec![vec![]; n],
            sz: vec![0; n],
            removed: vec![false; n],
            max_depth: 0,
        }
    }
}

fn get_size(u: usize, p: isize, ctx: &mut CentroidContext) {
    ctx.sz[u] = 1;
    // We need to iterate without borrowing ctx mutably inside loop if possible
    // But adj is inside ctx.
    // To solve borrow checker, we clone neighbors or use index-based access with unsafe, or separate adj.
    // Let's separate adj from context for recursion.
}

// Rewriting structure to satisfy Rust borrow checker
// Pass adj as reference, other state as mutable.

fn get_size_rust(u: usize, p: isize, adj: &Vec<Vec<usize>>, sz: &mut Vec<usize>, removed: &Vec<bool>) {
    sz[u] = 1;
    for &v in &adj[u] {
        if v as isize != p && !removed[v] {
            get_size_rust(v, u as isize, adj, sz, removed);
            sz[u] += sz[v];
        }
    }
}

fn get_centroid_rust(u: usize, p: isize, total: usize, adj: &Vec<Vec<usize>>, sz: &Vec<usize>, removed: &Vec<bool>) -> usize {
    for &v in &adj[u] {
        if v as isize != p && !removed[v] && sz[v] > total / 2 {
            return get_centroid_rust(v, u as isize, total, adj, sz, removed);
        }
    }
    u
}

fn decompose_rust(u: usize, depth: usize, adj: &Vec<Vec<usize>>, sz: &mut Vec<usize>, removed: &mut Vec<bool>, max_depth: &mut usize) {
    get_size_rust(u, -1, adj, sz, removed);
    let total = sz[u];
    let centroid = get_centroid_rust(u, -1, total, adj, sz, removed);

    *max_depth = max(*max_depth, depth);

    removed[centroid] = true;

    // Need to clone neighbors to avoid borrowing adj while recursing (actually adj is shared ref so ok)
    // But removed is mutable.
    let neighbors = adj[centroid].clone();
    for &v in &neighbors {
        if !removed[v] {
            decompose_rust(v, depth + 1, adj, sz, removed, max_depth);
        }
    }
}

pub fn centroid_tree(arr: &[i32]) -> i32 {
    if arr.len() < 1 {
        return 0;
    }
    let n = arr[0] as usize;

    if n <= 1 {
        return 0;
    }
    if arr.len() < 1 + 2 * (n - 1) {
        return 0;
    }

    let mut adj = vec![vec![]; n];
    for i in 0..n - 1 {
        let u = arr[1 + 2 * i] as usize;
        let v = arr[1 + 2 * i + 1] as usize;
        if u < n && v < n {
            adj[u].push(v);
            adj[v].push(u);
        }
    }

    let mut sz = vec![0; n];
    let mut removed = vec![false; n];
    let mut max_depth = 0;

    decompose_rust(0, 0, &adj, &mut sz, &mut removed, &mut max_depth);

    max_depth as i32
}
