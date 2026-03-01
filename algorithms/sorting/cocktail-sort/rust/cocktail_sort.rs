/**
 * Cocktail Sort implementation.
 * Repeatedly steps through the list in both directions, comparing adjacent elements 
 * and swapping them if they are in the wrong order.
 */
pub fn cocktail_sort(arr: &[i32]) -> Vec<i32> {
    let mut result = arr.to_vec();
    let n = result.len();

    if n <= 1 {
        return result;
    }

    let mut start = 0;
    let mut end = n - 1;
    let mut swapped = true;

    while swapped {
        swapped = false;

        // Forward pass
        for i in start..end {
            if result[i] > result[i + 1] {
                result.swap(i, i + 1);
                swapped = true;
            }
        }

        if !swapped {
            break;
        }

        swapped = false;
        end -= 1;

        // Backward pass
        for i in (start..end).rev() {
            if result[i] > result[i + 1] {
                result.swap(i, i + 1);
                swapped = true;
            }
        }

        start += 1;
    }

    result
}
