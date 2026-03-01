fn ext_gcd(a: i64, b: i64) -> (i64, i64, i64) {
    if a == 0 {
        return (b, 0, 1);
    }
    let (g, x1, y1) = ext_gcd(b % a, a);
    (g, y1 - (b / a) * x1, x1)
}

pub fn chinese_remainder(arr: &[i32]) -> i32 {
    let n = arr[0] as usize;
    let mut r = arr[1] as i64;
    let mut m = arr[2] as i64;

    for i in 1..n {
        let r2 = arr[1 + 2 * i] as i64;
        let m2 = arr[2 + 2 * i] as i64;
        let (g, p, _) = ext_gcd(m, m2);
        let lcm = m / g * m2;
        r = (r + m * ((r2 - r) / g) * p) % lcm;
        if r < 0 { r += lcm; }
        m = lcm;
    }

    (r % m) as i32
}
