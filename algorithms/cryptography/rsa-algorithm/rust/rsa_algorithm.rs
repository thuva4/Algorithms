fn mod_pow(mut base: i64, mut exp: i64, modulus: i64) -> i64 {
    let mut result = 1i64; base %= modulus;
    while exp > 0 {
        if exp & 1 == 1 { result = result * base % modulus; }
        exp >>= 1; base = base * base % modulus;
    }
    result
}

fn ext_gcd(a: i64, b: i64) -> (i64, i64, i64) {
    if a == 0 { return (b, 0, 1); }
    let (g, x1, y1) = ext_gcd(b % a, a);
    (g, y1 - (b / a) * x1, x1)
}

fn mod_inverse(e: i64, phi: i64) -> i64 {
    let (_, x, _) = ext_gcd(e % phi, phi);
    ((x % phi) + phi) % phi
}

fn rsa_algorithm(p: i64, q: i64, e: i64, message: i64) -> i64 {
    let n = p * q;
    let phi = (p - 1) * (q - 1);
    let d = mod_inverse(e, phi);
    let cipher = mod_pow(message, e, n);
    mod_pow(cipher, d, n)
}

fn main() {
    println!("{}", rsa_algorithm(61, 53, 17, 65));
    println!("{}", rsa_algorithm(61, 53, 17, 42));
    println!("{}", rsa_algorithm(11, 13, 7, 9));
}
