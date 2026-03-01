fn gcd(a: i64, b: i64) -> i64 {
    if b == 0 {
        return a;
    }
    gcd(b, a % b)
}

fn main() {
    println!("GCD of 48 and 18 is {}", gcd(48, 18));
    println!("GCD of 7 and 13 is {}", gcd(7, 13));
    println!("GCD of 0 and 5 is {}", gcd(0, 5));
}
