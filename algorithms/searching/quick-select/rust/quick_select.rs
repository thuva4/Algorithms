pub fn quick_select(arr: &mut [i32], k: usize) -> i32 {
    let n = arr.len();
    if n == 0 {
        return -1;
    }
    kth_smallest(arr, 0, n - 1, k)
}

fn kth_smallest(arr: &mut [i32], l: usize, r: usize, k: usize) -> i32 {
    if k > 0 && k <= r - l + 1 {
        let pos = partition(arr, l, r);
        
        if pos - l == k - 1 {
            return arr[pos];
        }
        if pos - l > k - 1 {
            return kth_smallest(arr, l, pos - 1, k);
        }
        return kth_smallest(arr, pos + 1, r, k - pos + l - 1);
    }
    -1
}

fn partition(arr: &mut [i32], l: usize, r: usize) -> usize {
    let x = arr[r];
    let mut i = l;
    for j in l..r {
        if arr[j] <= x {
            arr.swap(i, j);
            i += 1;
        }
    }
    arr.swap(i, r);
    i
}
