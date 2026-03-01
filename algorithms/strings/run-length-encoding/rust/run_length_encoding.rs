pub fn run_length_encoding(arr: &[i32]) -> Vec<i32> {
    if arr.is_empty() { return vec![]; }
    let mut result = Vec::new();
    let mut count = 1;
    for i in 1..arr.len() {
        if arr[i] == arr[i-1] { count += 1; }
        else { result.push(arr[i-1]); result.push(count); count = 1; }
    }
    result.push(*arr.last().unwrap());
    result.push(count);
    result
}
