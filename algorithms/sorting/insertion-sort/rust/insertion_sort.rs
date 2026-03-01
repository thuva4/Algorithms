/**
 * Insertion Sort implementation.
 * Builds the final sorted array (or list) one item at a time.
 */
pub fn insertion_sort(arr: &[i32]) -> Vec<i32> {
    let mut result = arr.to_vec();
    let n = result.len();

    for i in 1..n {
        let key = result[i];
        let mut j = i;

        while j > 0 && result[j - 1] > key {
            result[j] = result[j - 1];
            j -= 1;
        }
        result[j] = key;
    }

    result
}
