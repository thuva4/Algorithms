pub fn point_in_polygon(arr: &[i32]) -> i32 {
    let px = arr[0] as f64;
    let py = arr[1] as f64;
    let n = arr[2] as usize;

    let mut inside = false;
    let mut j = n - 1;
    for i in 0..n {
        let xi = arr[3 + 2 * i] as f64;
        let yi = arr[3 + 2 * i + 1] as f64;
        let xj = arr[3 + 2 * j] as f64;
        let yj = arr[3 + 2 * j + 1] as f64;

        if (yi > py) != (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi {
            inside = !inside;
        }
        j = i;
    }

    if inside { 1 } else { 0 }
}
