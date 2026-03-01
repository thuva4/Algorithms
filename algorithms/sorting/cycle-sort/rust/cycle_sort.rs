/**
 * Cycle Sort implementation.
 * An in-place, unstable sorting algorithm that is optimal in terms of
 * the number of writes to the original array.
 */
pub fn cycle_sort(arr: &[i32]) -> Vec<i32> {
    let mut result = arr.to_vec();
    let n = result.len();

    for cycle_start in 0..n {
        let mut item = result[cycle_start];

        let mut pos = cycle_start;
        for i in cycle_start + 1..n {
            if result[i] < item {
                pos += 1;
            }
        }

        if pos == cycle_start {
            continue;
        }

        while item == result[pos] {
            pos += 1;
        }

        if pos != cycle_start {
            std::mem::swap(&mut item, &mut result[pos]);
        }

        while pos != cycle_start {
            pos = cycle_start;
            for i in cycle_start + 1..n {
                if result[i] < item {
                    pos += 1;
                }
            }

            while item == result[pos] {
                pos += 1;
            }

            if item != result[pos] {
                std::mem::swap(&mut item, &mut result[pos]);
            }
        }
    }

    result
}
