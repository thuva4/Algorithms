fn mod_pow(mut base: i64, mut exp: i64, modulus: i64) -> i64 {
    let mut result = 1i64;
    base %= modulus;
    while exp > 0 {
        if exp % 2 == 1 {
            result = result * base % modulus;
        }
        exp /= 2;
        base = base * base % modulus;
    }
    result
}

pub fn miller_rabin(n: i32) -> i32 {
    if n < 2 { return 0; }
    if n < 4 { return 1; }
    if n % 2 == 0 { return 0; }

    let mut r = 0;
    let mut d = (n - 1) as i64;
    while d % 2 == 0 { r += 1; d /= 2; }

    let witnesses = [2i64, 3, 5, 7];
    for &a in &witnesses {
        if a >= n as i64 { continue; }

        let mut x = mod_pow(a, d, n as i64);
        if x == 1 || x == (n - 1) as i64 { continue; }

        let mut found = false;
        for _ in 0..(r - 1) {
            x = mod_pow(x, 2, n as i64);
            if x == (n - 1) as i64 { found = true; break; }
        }

        if !found { return 0; }
    }

    1
}
