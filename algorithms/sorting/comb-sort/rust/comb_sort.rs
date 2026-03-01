/**
 * Comb Sort implementation.
 * Improves on Bubble Sort by using a gap larger than 1.
 * The gap starts with a large value and shrinks by a factor of 1.3 in every iteration until it reaches 1.
 */
pub fn comb_sort(arr: &[i32]) -> Vec<i32> {
    let mut result = arr.to_vec();
    let n = result.len();
    if n < 2 {
        return result;
    }
    let mut gap = n;
    let shrink = 1.3;
    let mut sorted = false;

    while !sorted {
        gap = (gap as f64 / shrink).floor() as usize;
        if gap <= 1 {
            gap = 1;
            sorted = true;
        }

        for i in 0..n - gap {
            if result[i] > result[i + gap] {
                result.swap(i, i + gap);
                sorted = false;
            }
        }
    }

    result
}
