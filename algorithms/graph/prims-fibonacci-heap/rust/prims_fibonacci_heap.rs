use std::collections::BinaryHeap;
use std::cmp::Reverse;

pub fn prims_fibonacci_heap(arr: &[i32]) -> i32 {
    let n = arr[0] as usize;
    let m = arr[1] as usize;
    let mut adj: Vec<Vec<(i32, usize)>> = vec![vec![]; n];
    for i in 0..m {
        let u = arr[2 + 3 * i] as usize;
        let v = arr[2 + 3 * i + 1] as usize;
        let w = arr[2 + 3 * i + 2];
        adj[u].push((w, v));
        adj[v].push((w, u));
    }

    let inf = i32::MAX;
    let mut in_mst = vec![false; n];
    let mut key = vec![inf; n];
    key[0] = 0;
    let mut heap = BinaryHeap::new();
    heap.push(Reverse((0i32, 0usize)));
    let mut total = 0i32;

    while let Some(Reverse((w, u))) = heap.pop() {
        if in_mst[u] { continue; }
        in_mst[u] = true;
        total += w;
        for &(ew, v) in &adj[u] {
            if !in_mst[v] && ew < key[v] {
                key[v] = ew;
                heap.push(Reverse((ew, v)));
            }
        }
    }

    total
}
