/**
 * Gnome Sort implementation.
 * A sorting algorithm which is similar to insertion sort in that it works with one item at a time
 * but gets the item to the proper place by a series of swaps, similar to a bubble sort.
 */
pub fn gnome_sort(arr: &[i32]) -> Vec<i32> {
    let mut result = arr.to_vec();
    let n = result.len();
    if n < 2 {
        return result;
    }
    let mut index = 0;

    while index < n {
        if index == 0 {
            index += 1;
        }
        if index >= n {
            break;
        }
        if result[index] >= result[index - 1] {
            index += 1;
        } else {
            result.swap(index, index - 1);
            index -= 1;
        }
    }

    result
}
