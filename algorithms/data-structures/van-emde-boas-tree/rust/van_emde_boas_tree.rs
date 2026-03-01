use std::collections::BTreeSet;

/// Simplified vEB tree using BTreeSet for correctness.
/// A full vEB implementation in safe Rust requires complex ownership patterns.
fn van_emde_boas_tree(data: &[i32]) -> Vec<i32> {
    let _u = data[0];
    let n_ops = data[1] as usize;
    let mut set = BTreeSet::new();
    let mut results = Vec::new();
    let mut idx = 2;
    for _ in 0..n_ops {
        let op = data[idx];
        let val = data[idx + 1];
        idx += 2;
        match op {
            1 => { set.insert(val); }
            2 => { results.push(if set.contains(&val) { 1 } else { 0 }); }
            3 => {
                match set.range((val + 1)..).next() {
                    Some(&v) => results.push(v),
                    None => results.push(-1),
                }
            }
            _ => {}
        }
    }
    results
}

fn main() {
    println!("{:?}", van_emde_boas_tree(&[16, 4, 1, 3, 1, 5, 2, 3, 2, 7]));
    println!("{:?}", van_emde_boas_tree(&[16, 6, 1, 1, 1, 4, 1, 9, 2, 4, 3, 4, 3, 9]));
}
