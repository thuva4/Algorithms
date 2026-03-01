fn mod_pow(mut base: i64, mut exp: i64, m: i64) -> i64 {
    let mut result = 1i64; base %= m;
    while exp > 0 {
        if exp & 1 == 1 { result = result * base % m; }
        exp >>= 1; base = base * base % m;
    }
    result
}

fn lucas_theorem(mut n: i64, mut k: i64, p: i64) -> i64 {
    if k > n { return 0; }
    let mut fact = vec![1i64; p as usize];
    for i in 1..p as usize { fact[i] = fact[i - 1] * i as i64 % p; }

    let mut result = 1i64;
    while n > 0 || k > 0 {
        let ni = (n % p) as usize;
        let ki = (k % p) as usize;
        if ki > ni { return 0; }
        let c = fact[ni] * mod_pow(fact[ki], p - 2, p) % p * mod_pow(fact[ni - ki], p - 2, p) % p;
        result = result * c % p;
        n /= p; k /= p;
    }
    result
}

fn main() {
    println!("{}", lucas_theorem(10, 3, 7));
    println!("{}", lucas_theorem(5, 2, 3));
    println!("{}", lucas_theorem(100, 50, 13));
}
