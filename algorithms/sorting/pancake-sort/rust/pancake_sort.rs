/**
 * Pancake Sort implementation.
 * Sorts the array by repeatedly flipping subarrays.
 */
pub fn pancake_sort(arr: &[i32]) -> Vec<i32> {
    let mut result = arr.to_vec();
    let n = result.len();

    if n <= 1 {
        return result;
    }

    for curr_size in (2..=n).rev() {
        let mi = find_max(&result, curr_size);

        if mi != curr_size - 1 {
            flip(&mut result, mi);
            flip(&mut result, curr_size - 1);
        }
    }

    result
}

fn flip(arr: &mut [i32], k: usize) {
    let mut i = 0;
    let mut j = k;
    while i < j {
        arr.swap(i, j);
        i += 1;
        j -= 1;
    }
}

fn find_max(arr: &[i32], n: usize) -> usize {
    let mut mi = 0;
    for i in 0..n {
        if arr[i] > arr[mi] {
            mi = i;
        }
    }
    mi
}
