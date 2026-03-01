pub fn integer_sqrt(arr: &[i32]) -> i32 {
    let n = arr[0] as i64;
    if n <= 1 { return n as i32; }
    let mut x = n;
    loop {
        let x1 = (x + n / x) / 2;
        if x1 >= x { return x as i32; }
        x = x1;
    }
}
