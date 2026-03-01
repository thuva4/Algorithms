pub fn quick_sort(arr: &mut [i32]) {
    if !arr.is_empty() {
        let len = arr.len();
        _quick_sort(arr, 0, (len - 1) as isize);
    }
}

fn _quick_sort(arr: &mut [i32], low: isize, high: isize) {
    if low < high {
        let pi = partition(arr, low, high);
        
        _quick_sort(arr, low, pi - 1);
        _quick_sort(arr, pi + 1, high);
    }
}

fn partition(arr: &mut [i32], low: isize, high: isize) -> isize {
    let pivot = arr[high as usize];
    let mut i = low - 1;
    
    for j in low..high {
        if arr[j as usize] < pivot {
            i += 1;
            arr.swap(i as usize, j as usize);
        }
    }
    arr.swap((i + 1) as usize, high as usize);
    return i + 1;
}
