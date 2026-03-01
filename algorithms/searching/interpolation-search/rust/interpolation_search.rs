pub fn interpolation_search(arr: &[i32], target: i32) -> i32 {
    let n = arr.len();
    if n == 0 {
        return -1;
    }
    
    let mut lo = 0;
    let mut hi = n - 1;
    
    while lo <= hi && target >= arr[lo] && target <= arr[hi] {
        if lo == hi {
            if arr[lo] == target {
                return lo as i32;
            }
            return -1;
        }
        
        if arr[hi] == arr[lo] {
            if arr[lo] == target {
                return lo as i32;
            }
            return -1;
        }
        
        let pos = lo + (((hi - lo) as f64 / (arr[hi] - arr[lo]) as f64) * (target - arr[lo]) as f64) as usize;
        
        if arr[pos] == target {
            return pos as i32;
        }
        
        if arr[pos] < target {
            lo = pos + 1;
        } else {
            hi = pos - 1;
        }
    }
    -1
}
