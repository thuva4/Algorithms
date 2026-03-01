fn gcd(mut a: i64, mut b: i64) -> i64 {
    a = a.abs();
    while b != 0 { let t = b; b = a % b; a = t; }
    a
}

fn is_prime(n: i64) -> bool {
    if n < 2 { return false; }
    if n < 4 { return true; }
    if n % 2 == 0 || n % 3 == 0 { return false; }
    let mut i = 5i64;
    while i * i <= n {
        if n % i == 0 || n % (i + 2) == 0 { return false; }
        i += 6;
    }
    true
}

fn rho(n: i64) -> i64 {
    if n % 2 == 0 { return 2; }
    let (mut x, mut y, c) = (2i64, 2i64, 1i64);
    let mut d = 1i64;
    while d == 1 {
        x = ((x as i128 * x as i128 + c as i128) % n as i128) as i64;
        y = ((y as i128 * y as i128 + c as i128) % n as i128) as i64;
        y = ((y as i128 * y as i128 + c as i128) % n as i128) as i64;
        d = gcd((x - y).abs(), n);
    }
    if d != n { d } else { n }
}

fn pollards_rho(n: i64) -> i64 {
    if n <= 1 { return n; }
    if is_prime(n) { return n; }
    let mut smallest = n;
    let mut stack = vec![n];
    while let Some(num) = stack.pop() {
        if num <= 1 { continue; }
        if is_prime(num) { smallest = smallest.min(num); continue; }
        let d = rho(num);
        stack.push(d);
        stack.push(num / d);
    }
    smallest
}

fn main() {
    println!("{}", pollards_rho(15));
    println!("{}", pollards_rho(13));
    println!("{}", pollards_rho(91));
    println!("{}", pollards_rho(221));
}
