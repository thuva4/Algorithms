pub fn extended_gcd(a: i64, b: i64) -> Vec<i64> {
    if a == 0 {
        return vec![b.abs(), 0, if b >= 0 { 1 } else { -1 }];
    }

    let result = extended_gcd(b.rem_euclid(a), a);
    let gcd = result[0];
    let x = result[2] - (b / a) * result[1];
    let y = result[1];
    vec![gcd, x, y]
}
