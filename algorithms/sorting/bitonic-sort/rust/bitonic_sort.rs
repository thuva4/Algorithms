/**
 * Bitonic Sort implementation.
 * Works on any array size by padding to the nearest power of 2.
 */
pub fn bitonic_sort(arr: &[i32]) -> Vec<i32> {
    if arr.is_empty() {
        return Vec::new();
    }

    let n = arr.len();
    let mut next_pow2 = 1;
    while next_pow2 < n {
        next_pow2 *= 2;
    }

    // Pad the array to the next power of 2
    // We use i32::MAX for padding to handle ascending sort
    let mut padded = vec![i32::MAX; next_pow2];
    for (i, &val) in arr.iter().enumerate() {
        padded[i] = val;
    }

    bitonic_sort_recursive(&mut padded, 0, next_pow2, true);

    // Return the first n elements (trimmed back to original size)
    padded.truncate(n);
    padded
}

fn compare_and_swap(arr: &mut [i32], i: usize, j: usize, ascending: bool) {
    if (ascending && arr[i] > arr[j]) || (!ascending && arr[i] < arr[j]) {
        arr.swap(i, j);
    }
}

fn bitonic_merge(arr: &mut [i32], low: usize, cnt: usize, ascending: bool) {
    if cnt > 1 {
        let k = cnt / 2;
        for i in low..low + k {
            compare_and_swap(arr, i, i + k, ascending);
        }
        bitonic_merge(arr, low, k, ascending);
        bitonic_merge(arr, low + k, k, ascending);
    }
}

fn bitonic_sort_recursive(arr: &mut [i32], low: usize, cnt: usize, ascending: bool) {
    if cnt > 1 {
        let k = cnt / 2;
        // Sort first half in ascending order
        bitonic_sort_recursive(arr, low, k, true);
        // Sort second half in descending order
        bitonic_sort_recursive(arr, low + k, k, false);
        // Merge the whole sequence in given order
        bitonic_merge(arr, low, cnt, ascending);
    }
}
