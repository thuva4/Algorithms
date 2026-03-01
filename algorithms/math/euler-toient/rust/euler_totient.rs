pub fn euler_totient(n: i64) -> i64 {
    if n <= 1 {
        return 1;
    }

    let mut value = n;
    let mut result = n;
    let mut factor = 2i64;

    while factor * factor <= value {
        if value % factor == 0 {
            while value % factor == 0 {
                value /= factor;
            }
            result -= result / factor;
        }
        factor += 1;
    }

    if value > 1 {
        result -= result / value;
    }

    result
}
