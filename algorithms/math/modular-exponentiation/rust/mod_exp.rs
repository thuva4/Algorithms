pub fn mod_exp(arr: &[i32]) -> i32 {
    let mut base = arr[0] as i64;
    let mut exp = arr[1] as i64;
    let modulus = arr[2] as i64;
    if modulus == 1 { return 0; }
    let mut result: i64 = 1;
    base %= modulus;
    while exp > 0 {
        if exp & 1 == 1 {
            result = (result * base) % modulus;
        }
        exp >>= 1;
        base = (base * base) % modulus;
    }
    result as i32
}
