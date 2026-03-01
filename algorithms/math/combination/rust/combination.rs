#[allow(non_snake_case)]
pub fn nCr(n: i64, r: i64) -> i64 {
    if r < 0 || r > n {
        return 0;
    }

    let k = r.min(n - r);
    if k == 0 {
        return 1;
    }

    let mut result = 1i64;
    for i in 1..=k {
        result = result * (n - k + i) / i;
    }

    result
}
