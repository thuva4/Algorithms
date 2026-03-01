pub fn binary_search(arr: &[i32], target: i32) -> i32 {
    let mut left = 0;
    let mut right = arr.len() as isize - 1;

    while left <= right {
        let mid = left + (right - left) / 2;
        let mid_idx = mid as usize;

        if arr[mid_idx] == target {
            return mid_idx as i32;
        }

        if arr[mid_idx] < target {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    -1
}
