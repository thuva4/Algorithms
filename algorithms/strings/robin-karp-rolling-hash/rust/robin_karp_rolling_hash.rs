fn modpow(mut base: i64, mut exp: i64, m: i64) -> i64 {
    let mut r = 1i64; base %= m;
    while exp > 0 { if exp & 1 == 1 { r = r * base % m; } exp >>= 1; base = base * base % m; }
    r
}

pub fn robin_karp_rolling_hash(arr: &[i32]) -> i32 {
    let mut idx = 0;
    let tlen = arr[idx] as usize; idx += 1;
    let text = &arr[idx..idx+tlen]; idx += tlen;
    let plen = arr[idx] as usize; idx += 1;
    let pattern = &arr[idx..idx+plen];
    if plen > tlen { return -1; }

    let base: i64 = 31; let m: i64 = 1_000_000_007;
    let mut p_hash: i64 = 0; let mut t_hash: i64 = 0; let mut power: i64 = 1;
    for i in 0..plen {
        p_hash = (p_hash + (pattern[i] as i64 + 1) * power) % m;
        t_hash = (t_hash + (text[i] as i64 + 1) * power) % m;
        if i < plen - 1 { power = power * base % m; }
    }

    let inv_base = modpow(base, m - 2, m);

    for i in 0..=tlen-plen {
        if t_hash == p_hash {
            let mut matched = true;
            for j in 0..plen { if text[i+j] != pattern[j] { matched = false; break; } }
            if matched { return i as i32; }
        }
        if i < tlen - plen {
            t_hash = ((t_hash - (text[i] as i64 + 1)) % m + m) % m;
            t_hash = t_hash * inv_base % m;
            t_hash = (t_hash + (text[i+plen] as i64 + 1) * power) % m;
        }
    }
    -1
}

fn main() {
    println!("{}", robin_karp_rolling_hash(&[5, 1, 2, 3, 4, 5, 2, 1, 2]));
    println!("{}", robin_karp_rolling_hash(&[5, 1, 2, 3, 4, 5, 2, 3, 4]));
    println!("{}", robin_karp_rolling_hash(&[4, 1, 2, 3, 4, 2, 5, 6]));
    println!("{}", robin_karp_rolling_hash(&[4, 1, 2, 3, 4, 1, 4]));
}
