pub fn activity_selection(arr: &[i32]) -> i32 {
    let n = arr.len() / 2;
    if n == 0 {
        return 0;
    }

    let mut activities: Vec<(i32, i32)> = (0..n)
        .map(|i| (arr[2 * i], arr[2 * i + 1]))
        .collect();

    activities.sort_by_key(|a| a.1);

    let mut count = 1;
    let mut last_finish = activities[0].1;

    for i in 1..n {
        if activities[i].0 >= last_finish {
            count += 1;
            last_finish = activities[i].1;
        }
    }

    count
}
