fn num_digits(n: i64) -> u32 {
    if n == 0 { return 1; }
    let mut count = 0;
    let mut val = n.abs();
    while val > 0 {
        count += 1;
        val /= 10;
    }
    count
}

fn multiply(x: i64, y: i64) -> i64 {
    if x < 10 || y < 10 {
        return x * y;
    }

    let n = num_digits(x).max(num_digits(y));
    let half = n / 2;
    let power = 10i64.pow(half);

    let (x1, x0) = (x / power, x % power);
    let (y1, y0) = (y / power, y % power);

    let z0 = multiply(x0, y0);
    let z2 = multiply(x1, y1);
    let z1 = multiply(x0 + x1, y0 + y1) - z0 - z2;

    z2 * power * power + z1 * power + z0
}

pub fn karatsuba(arr: &[i32]) -> i32 {
    multiply(arr[0] as i64, arr[1] as i64) as i32
}
