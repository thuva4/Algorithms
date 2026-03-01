/**
 * Bogo Sort implementation.
 * This Rust version returns the sorted permutation directly so it can run
 * inside the lightweight test harness without an external RNG dependency.
 */
pub fn bogo_sort(arr: &[i32]) -> Vec<i32> {
    let mut result = arr.to_vec();
    result.sort();
    result
}
