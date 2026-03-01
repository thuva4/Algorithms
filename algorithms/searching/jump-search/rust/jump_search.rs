use std::cmp::min;

pub fn jump_search(arr: &[i32], target: i32) -> i32 {
    let n = arr.len();
    if n == 0 {
        return -1;
    }

    let mut step = (n as f64).sqrt() as usize;
    let mut prev = 0;

    while arr[min(step, n) - 1] < target {
        prev = step;
        step += (n as f64).sqrt() as usize;
        if prev >= n {
            return -1;
        }
    }

    while arr[prev] < target {
        prev += 1;
        if prev == min(step, n) {
            return -1;
        }
    }

    if arr[prev] == target {
        return prev as i32;
    }

    -1
}
