pub fn selection_sort(arr: &mut [i32]) {
    let n = arr.len();
    if n == 0 {
        return;
    }
    
    for i in 0..n-1 {
        let mut min_idx = i;
        for j in i+1..n {
            if arr[j] < arr[min_idx] {
                min_idx = j;
            }
        }
        arr.swap(min_idx, i);
    }
}
