use std::collections::HashSet;

pub fn planarity_testing(arr: &[i32]) -> i32 {
    let n = arr[0] as usize;
    let m = arr[1] as usize;
    let mut edges = HashSet::new();
    for i in 0..m {
        let u = arr[2 + 2 * i] as usize;
        let v = arr[2 + 2 * i + 1] as usize;
        if u != v {
            let a = u.min(v);
            let b = u.max(v);
            edges.insert((a, b));
        }
    }
    let e = edges.len();
    if n < 3 { return 1; }
    if e <= 3 * n - 6 { 1 } else { 0 }
}
