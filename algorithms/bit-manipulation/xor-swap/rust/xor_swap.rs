fn xor_swap(a: i32, b: i32) -> (i32, i32) {
    let mut x = a;
    let mut y = b;
    if x != y {
        x = x ^ y;
        y = x ^ y;
        x = x ^ y;
    }
    (x, y)
}

fn main() {
    let (a, b) = xor_swap(5, 10);
    println!("After swap: a={}, b={}", a, b);
}
