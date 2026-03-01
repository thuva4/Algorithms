pub fn is_prime(n: i64) -> bool {
    if n <= 1 {
        return false;
    }
    if n <= 3 {
        return true;
    }
    if n % 2 == 0 || n % 3 == 0 {
        return false;
    }

    let mut factor = 5i64;
    while factor * factor <= n {
        if n % factor == 0 || n % (factor + 2) == 0 {
            return false;
        }
        factor += 6;
    }

    true
}
