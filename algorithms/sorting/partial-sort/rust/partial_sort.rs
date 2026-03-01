use std::collections::BinaryHeap;

/**
 * Partial Sort implementation.
 * Returns the smallest k elements of the array in sorted order.
 */
pub fn partial_sort_k(arr: &[i32], k: usize) -> Vec<i32> {
    if k == 0 {
        return Vec::new();
    }
    if k >= arr.len() {
        let mut result = arr.to_vec();
        result.sort_unstable();
        return result;
    }

    let mut max_heap = BinaryHeap::new();

    for &num in arr {
        max_heap.push(num);
        if max_heap.len() > k {
            max_heap.pop();
        }
    }

    let mut result = max_heap.into_sorted_vec();
    // into_sorted_vec returns ascending order
    result
}

pub fn partial_sort(arr: &[i32]) -> Vec<i32> {
    partial_sort_k(arr, arr.len())
}
