fn kd_tree(data: &[i64]) -> i64 {
    let n = data[0] as usize;
    let qx = data[1 + 2 * n];
    let qy = data[2 + 2 * n];
    let mut best = i64::MAX;
    let mut idx = 1;
    for _ in 0..n {
        let dx = data[idx] - qx;
        let dy = data[idx + 1] - qy;
        let d = dx * dx + dy * dy;
        if d < best { best = d; }
        idx += 2;
    }
    best
}

fn main() {
    println!("{}", kd_tree(&[3, 1, 2, 3, 4, 5, 6, 3, 3]));
    println!("{}", kd_tree(&[2, 0, 0, 5, 5, 0, 0]));
    println!("{}", kd_tree(&[1, 3, 4, 0, 0]));
}
