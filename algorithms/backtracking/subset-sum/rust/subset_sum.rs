pub fn subset_sum(arr: &[i32], target: i32) -> i32 {
    if backtrack(arr, 0, target) {
        1
    } else {
        0
    }
}

fn backtrack(arr: &[i32], index: usize, remaining: i32) -> bool {
    if remaining == 0 {
        return true;
    }
    if index >= arr.len() {
        return false;
    }
    // Include arr[index]
    if backtrack(arr, index + 1, remaining - arr[index]) {
        return true;
    }
    // Exclude arr[index]
    if backtrack(arr, index + 1, remaining) {
        return true;
    }
    false
}
