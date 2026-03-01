pub fn interval_scheduling(arr: &[i32]) -> i32 {
    let n = arr[0] as usize;
    let mut intervals: Vec<(i32, i32)> = (0..n)
        .map(|i| (arr[1 + 2 * i], arr[1 + 2 * i + 1]))
        .collect();

    intervals.sort_by_key(|iv| iv.1);

    let mut count = 0;
    let mut last_end = -1;
    for (start, end) in &intervals {
        if *start >= last_end {
            count += 1;
            last_end = *end;
        }
    }

    count
}
