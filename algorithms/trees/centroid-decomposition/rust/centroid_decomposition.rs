pub fn centroid_decomposition(arr: &[i32]) -> i32 {
    let mut idx = 0;
    let n = arr[idx] as usize; idx += 1;
    if n <= 1 { return 0; }

    let mut adj: Vec<Vec<usize>> = vec![vec![]; n];
    let m = (arr.len() - 1) / 2;
    for _ in 0..m {
        let u = arr[idx] as usize; idx += 1;
        let v = arr[idx] as usize; idx += 1;
        adj[u].push(v); adj[v].push(u);
    }

    let mut removed = vec![false; n];
    let mut sub_size = vec![0usize; n];

    fn get_sub_size(v: usize, parent: i32, adj: &[Vec<usize>], removed: &[bool], sub_size: &mut [usize]) {
        sub_size[v] = 1;
        for &u in &adj[v] {
            if u as i32 != parent && !removed[u] {
                get_sub_size(u, v as i32, adj, removed, sub_size);
                sub_size[v] += sub_size[u];
            }
        }
    }

    fn get_centroid(v: usize, parent: i32, tree_size: usize, adj: &[Vec<usize>], removed: &[bool], sub_size: &[usize]) -> usize {
        for &u in &adj[v] {
            if u as i32 != parent && !removed[u] && sub_size[u] > tree_size / 2 {
                return get_centroid(u, v as i32, tree_size, adj, removed, sub_size);
            }
        }
        v
    }

    fn decompose(v: usize, depth: i32, adj: &[Vec<usize>], removed: &mut [bool], sub_size: &mut [usize]) -> i32 {
        get_sub_size(v, -1, adj, removed, sub_size);
        let centroid = get_centroid(v, -1, sub_size[v], adj, removed, sub_size);
        removed[centroid] = true;
        let mut max_depth = depth;
        let neighbors: Vec<usize> = adj[centroid].clone();
        for u in neighbors {
            if !removed[u] {
                let result = decompose(u, depth + 1, adj, removed, sub_size);
                if result > max_depth { max_depth = result; }
            }
        }
        removed[centroid] = false;
        max_depth
    }

    decompose(0, 0, &adj, &mut removed, &mut sub_size)
}

fn main() {
    println!("{}", centroid_decomposition(&[4, 0, 1, 1, 2, 2, 3]));
    println!("{}", centroid_decomposition(&[5, 0, 1, 0, 2, 0, 3, 0, 4]));
    println!("{}", centroid_decomposition(&[1]));
    println!("{}", centroid_decomposition(&[7, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6]));
}
