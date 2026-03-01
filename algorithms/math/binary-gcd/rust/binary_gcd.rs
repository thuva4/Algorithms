pub fn binary_gcd(a: i64, b: i64) -> i64 {
    if a == 0 {
        return b.abs();
    }
    if b == 0 {
        return a.abs();
    }

    let mut x = a.abs() as u64;
    let mut y = b.abs() as u64;
    let shift = (x | y).trailing_zeros();

    x >>= x.trailing_zeros();
    while y != 0 {
        y >>= y.trailing_zeros();
        if x > y {
            std::mem::swap(&mut x, &mut y);
        }
        y -= x;
    }

    (x << shift) as i64
}
