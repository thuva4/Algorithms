const MOD: i64 = 998244353;
const G_ROOT: i64 = 3;

fn mod_pow(mut base: i64, mut exp: i64, modulus: i64) -> i64 {
    let mut result = 1i64;
    base %= modulus;
    while exp > 0 {
        if exp & 1 == 1 { result = result * base % modulus; }
        exp >>= 1;
        base = base * base % modulus;
    }
    result
}

fn ntt_transform(a: &mut Vec<i64>, invert: bool) {
    let n = a.len();
    let mut j = 0usize;
    for i in 1..n {
        let mut bit = n >> 1;
        while j & bit != 0 { j ^= bit; bit >>= 1; }
        j ^= bit;
        if i < j { a.swap(i, j); }
    }
    let mut len = 2;
    while len <= n {
        let mut w = mod_pow(G_ROOT, (MOD - 1) / len as i64, MOD);
        if invert { w = mod_pow(w, MOD - 2, MOD); }
        let half = len / 2;
        let mut i = 0;
        while i < n {
            let mut wn = 1i64;
            for k in 0..half {
                let u = a[i + k];
                let v = a[i + k + half] * wn % MOD;
                a[i + k] = (u + v) % MOD;
                a[i + k + half] = (u - v + MOD) % MOD;
                wn = wn * w % MOD;
            }
            i += len;
        }
        len <<= 1;
    }
    if invert {
        let inv_n = mod_pow(n as i64, MOD - 2, MOD);
        for x in a.iter_mut() { *x = *x * inv_n % MOD; }
    }
}

fn ntt(data: &[i32]) -> Vec<i32> {
    let mut idx = 0;
    let na = data[idx] as usize; idx += 1;
    let a: Vec<i64> = (0..na).map(|i| ((data[idx + i] as i64 % MOD) + MOD) % MOD).collect();
    idx += na;
    let nb = data[idx] as usize; idx += 1;
    let b: Vec<i64> = (0..nb).map(|i| ((data[idx + i] as i64 % MOD) + MOD) % MOD).collect();

    let result_len = na + nb - 1;
    let mut n = 1;
    while n < result_len { n <<= 1; }

    let mut fa = vec![0i64; n];
    let mut fb = vec![0i64; n];
    fa[..na].copy_from_slice(&a);
    fb[..nb].copy_from_slice(&b);

    ntt_transform(&mut fa, false);
    ntt_transform(&mut fb, false);
    for i in 0..n { fa[i] = fa[i] * fb[i] % MOD; }
    ntt_transform(&mut fa, true);

    fa[..result_len].iter().map(|&x| x as i32).collect()
}

fn main() {
    println!("{:?}", ntt(&[2, 1, 2, 2, 3, 4]));
    println!("{:?}", ntt(&[2, 1, 1, 2, 1, 1]));
}
