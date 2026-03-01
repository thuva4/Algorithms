use std::cmp::min;

const RUN: usize = 32;

pub fn tim_sort(arr: &mut [i32]) {
    let n = arr.len();
    if n == 0 { return; }

    let mut i = 0;
    while i < n {
        insertion_sort(arr, i, min(i + RUN - 1, n - 1));
        i += RUN;
    }

    let mut size = RUN;
    while size < n {
        let mut left = 0;
        while left < n {
            let mid = left + size - 1;
            let right = min(left + 2 * size - 1, n - 1);

            if mid < right {
                merge(arr, left, mid, right);
            }
            left += 2 * size;
        }
        size *= 2;
    }
}

fn insertion_sort(arr: &mut [i32], left: usize, right: usize) {
    for i in left + 1..=right {
        let temp = arr[i];
        let mut j = i;
        while j > left && arr[j - 1] > temp {
            arr[j] = arr[j - 1];
            j -= 1;
        }
        arr[j] = temp;
    }
}

fn merge(arr: &mut [i32], l: usize, m: usize, r: usize) {
    let len1 = m - l + 1;
    let len2 = r - m;
    let mut left = vec![0; len1];
    let mut right = vec![0; len2];

    for i in 0..len1 {
        left[i] = arr[l + i];
    }
    for i in 0..len2 {
        right[i] = arr[m + 1 + i];
    }

    let mut i = 0;
    let mut j = 0;
    let mut k = l;

    while i < len1 && j < len2 {
        if left[i] <= right[j] {
            arr[k] = left[i];
            i += 1;
        } else {
            arr[k] = right[j];
            j += 1;
        }
        k += 1;
    }

    while i < len1 {
        arr[k] = left[i];
        k += 1;
        i += 1;
    }

    while j < len2 {
        arr[k] = right[j];
        k += 1;
        j += 1;
    }
}
