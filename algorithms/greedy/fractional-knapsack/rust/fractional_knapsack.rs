pub fn fractional_knapsack(arr: &[i32]) -> i32 {
    let capacity = arr[0];
    let n = arr[1] as usize;
    let mut items: Vec<(i32, i32)> = Vec::new();
    let mut idx = 2;
    for _ in 0..n {
        items.push((arr[idx], arr[idx + 1]));
        idx += 2;
    }

    items.sort_by(|a, b| {
        let ra = a.0 as f64 / a.1 as f64;
        let rb = b.0 as f64 / b.1 as f64;
        rb.partial_cmp(&ra).unwrap()
    });

    let mut total_value: f64 = 0.0;
    let mut remaining = capacity;
    for &(value, weight) in &items {
        if remaining <= 0 { break; }
        if weight <= remaining {
            total_value += value as f64;
            remaining -= weight;
        } else {
            total_value += value as f64 * remaining as f64 / weight as f64;
            remaining = 0;
        }
    }
    (total_value * 100.0) as i32
}
