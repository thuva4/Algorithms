pub fn linear_search(arr: &[i32], target: i32) -> i32 {
    for (i, &item) in arr.iter().enumerate() {
        if item == target {
            return i as i32;
        }
    }
    -1
}
