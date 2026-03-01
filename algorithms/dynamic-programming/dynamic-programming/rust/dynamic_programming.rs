pub fn max_1d_range_sum(values: &[i32]) -> i32 {
    let mut best = 0;
    let mut current = 0;

    for &value in values {
        current = (current + value).max(0);
        best = best.max(current);
    }

    best
}
