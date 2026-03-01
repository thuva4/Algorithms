pub fn modified_binary_search(arr: &[i32], target: i32) -> i32 {
    let n = arr.len();
    if n == 0 {
        return -1;
    }
    
    let mut start = 0;
    let mut end = n - 1;
    
    let is_ascending = arr[start] <= arr[end];
    
    while start <= end {
        let mid = start + (end - start) / 2;
        
        if arr[mid] == target {
            return mid as i32;
        }
        
        if is_ascending {
            if target < arr[mid] {
                if mid == 0 { break; } // prevent underflow if end becomes 0-1
                end = mid - 1;
            } else {
                start = mid + 1;
            }
        } else {
            if target > arr[mid] {
                if mid == 0 { break; }
                end = mid - 1;
            } else {
                start = mid + 1;
            }
        }
    }
    -1
}
