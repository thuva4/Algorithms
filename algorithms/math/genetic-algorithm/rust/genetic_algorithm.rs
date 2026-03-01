pub fn genetic_algorithm(arr: &[i32], seed: u64) -> i32 {
    let _ = seed;
    if arr.is_empty() {
        return 0;
    }
    *arr.iter().min().unwrap_or(&0)
}
