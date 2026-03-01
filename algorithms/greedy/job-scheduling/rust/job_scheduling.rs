pub fn job_scheduling(arr: &[i32]) -> i32 {
    let n = arr[0] as usize;
    let mut jobs: Vec<(i32, i32)> = (0..n)
        .map(|i| (arr[1 + 2 * i], arr[1 + 2 * i + 1]))
        .collect();

    let max_deadline = jobs.iter().map(|j| j.0).max().unwrap_or(0) as usize;

    jobs.sort_by(|a, b| b.1.cmp(&a.1));

    let mut slots = vec![false; max_deadline + 1];
    let mut total_profit = 0;

    for (deadline, profit) in &jobs {
        let d = (*deadline as usize).min(max_deadline);
        for t in (1..=d).rev() {
            if !slots[t] {
                slots[t] = true;
                total_profit += profit;
                break;
            }
        }
    }

    total_profit
}
