pub fn ternary_search(arr: &[i32], target: i32) -> i32 {
    let n = arr.len();
    if n == 0 {
        return -1;
    }
    
    let mut l = 0isize;
    let mut r = n as isize - 1;
    
    while r >= l {
        let mid1 = l + (r - l) / 3;
        let mid2 = r - (r - l) / 3;
        
        if arr[mid1 as usize] == target {
            return mid1 as i32;
        }
        if arr[mid2 as usize] == target {
            return mid2 as i32;
        }
        
        if target < arr[mid1 as usize] {
            r = mid1 - 1;
        } else if target > arr[mid2 as usize] {
            l = mid2 + 1;
        } else {
            l = mid1 + 1;
            r = mid2 - 1;
        }
    }
    -1
}
