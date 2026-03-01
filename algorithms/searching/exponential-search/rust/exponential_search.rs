use std::cmp::min;

pub fn exponential_search(arr: &[i32], target: i32) -> i32 {
    let n = arr.len();
    if n == 0 {
        return -1;
    }
    if arr[0] == target {
        return 0;
    }

    let mut i = 1;
    while i < n && arr[i] <= target {
        i *= 2;
    }

    binary_search(arr, i / 2, min(i, n) - 1, target)
}

fn binary_search(arr: &[i32], l: usize, r: usize, target: i32) -> i32 {
    let mut left = l;
    let mut right = r;
    
    // Safety check for empty range or right < left if not handled by caller
    if left > right { return -1; }

    while left <= right {
        let mid = left + (right - left) / 2;
        if arr[mid] == target {
            return mid as i32;
        }
        if arr[mid] < target {
            left = mid + 1;
        } else {
            if mid == 0 { break; } // avoid underflow
            right = mid - 1;
        }
    }
    -1
}
