/**
 * Bubble Sort implementation.
 * Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.
 * Includes the 'swapped' flag optimization to terminate early if the array is already sorted.
 */
pub fn bubble_sort(arr: &[i32]) -> Vec<i32> {
    let mut result = arr.to_vec();
    let n = result.len();

    if n <= 1 {
        return result;
    }

    for i in 0..n - 1 {
        // Optimization: track if any swaps occurred in this pass
        let mut swapped = false;

        // Last i elements are already in place, so we don't need to check them
        for j in 0..n - i - 1 {
            if result[j] > result[j + 1] {
                // Swap elements if they are in the wrong order
                result.swap(j, j + 1);
                swapped = true;
            }
        }

        // If no two elements were swapped by inner loop, then break
        if !swapped {
            break;
        }
    }

    result
}
