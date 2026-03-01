/**
 * Heap Sort implementation.
 * Sorts an array by first building a max heap, then repeatedly extracting the maximum element.
 */
pub fn heap_sort(arr: &[i32]) -> Vec<i32> {
    let mut result = arr.to_vec();
    let n = result.len();

    if n <= 1 {
        return result;
    }

    // Build max heap
    for i in (0..n / 2).rev() {
        heapify(&mut result, n, i);
    }

    // Extract elements
    for i in (1..n).rev() {
        result.swap(0, i);
        heapify(&mut result, i, 0);
    }

    result
}

fn heapify(arr: &mut [i32], n: usize, i: usize) {
    let mut largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    if l < n && arr[l] > arr[largest] {
        largest = l;
    }

    if r < n && arr[r] > arr[largest] {
        largest = r;
    }

    if largest != i {
        arr.swap(i, largest);
        heapify(arr, n, largest);
    }
}
