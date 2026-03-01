fn ext_gcd(a: i64, b: i64) -> (i64, i64, i64) {
    if a == 0 { return (b, 0, 1); }
    let (g, x1, y1) = ext_gcd(b % a, a);
    (g, y1 - (b / a) * x1, x1)
}

pub fn extended_gcd_applications(arr: &[i32]) -> i32 {
    let a = arr[0] as i64; let m = arr[1] as i64;
    let (g, x, _) = ext_gcd(((a % m) + m) % m, m);
    if g != 1 { return -1; }
    (((x % m) + m) % m) as i32
}

fn main() {
    println!("{}", extended_gcd_applications(&[3, 7]));
    println!("{}", extended_gcd_applications(&[1, 13]));
    println!("{}", extended_gcd_applications(&[6, 9]));
    println!("{}", extended_gcd_applications(&[2, 11]));
}
