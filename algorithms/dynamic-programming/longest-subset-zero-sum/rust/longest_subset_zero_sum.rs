use std::collections::HashMap;
use std::cmp;

pub fn longest_subset_zero_sum(arr: &[i32]) -> usize {
    let mut max_len = 0usize;
    let mut sum_map: HashMap<i32, i32> = HashMap::new();
    sum_map.insert(0, -1);
    let mut sum = 0i32;

    for i in 0..arr.len() {
        sum += arr[i];
        if let Some(&idx) = sum_map.get(&sum) {
            let length = (i as i32 - idx) as usize;
            max_len = cmp::max(max_len, length);
        } else {
            sum_map.insert(sum, i as i32);
        }
    }

    max_len
}

fn main() {
    let arr = vec![1, 2, -3, 3];
    println!("{}", longest_subset_zero_sum(&arr)); // 3
}
