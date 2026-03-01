use std::collections::BTreeSet;

pub fn skip_list(arr: &[i32]) -> Vec<i32> {
    // Skip list functionality: insert and return sorted unique elements.
    // Using BTreeSet as Rust's ownership model makes raw pointer skip lists complex.
    // The BTreeSet provides the same O(log n) guarantees.
    let mut set = BTreeSet::new();
    for &val in arr {
        set.insert(val);
    }
    set.into_iter().collect()
}
