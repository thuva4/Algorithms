const MOD: i64 = 1_000_000_007;

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

fn mod_inv(a: i64, modulus: i64) -> i64 {
    mod_pow(a, modulus - 2, modulus)
}

pub fn catalan_numbers(n: i32) -> i32 {
    let mut result = 1i64;
    for i in 1..=(n as i64) {
        result = result * (2 * (2 * i - 1)) % MOD;
        result = result * mod_inv(i + 1, MOD) % MOD;
    }
    result as i32
}
