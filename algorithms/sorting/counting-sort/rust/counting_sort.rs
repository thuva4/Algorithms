/**
 * Counting Sort implementation.
 * Efficient for sorting integers with a known small range.
 */
pub fn counting_sort(arr: &[i32]) -> Vec<i32> {
    if arr.is_empty() {
        return Vec::new();
    }

    let min_val = *arr.iter().min().unwrap();
    let max_val = *arr.iter().max().unwrap();
    let range = (max_val - min_val + 1) as usize;

    let mut count = vec![0; range];
    let mut output = vec![0; arr.len()];

    for &x in arr {
        count[(x - min_val) as usize] += 1;
    }

    for i in 1..range {
        count[i] += count[i - 1];
    }

    for &x in arr.iter().rev() {
        let index = (x - min_val) as usize;
        output[count[index] - 1] = x;
        count[index] -= 1;
    }

    output
}
