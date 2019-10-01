fn xor_swap<T: std::ops::BitXorAssign + Copy>(a: &mut T, b: &mut T) {
    *a ^= *b;
    *b ^= *a;
    *a ^= *b;
}

fn main() {
    let mut buf = String::new();
    println!("Enter number a:");
    std::io::stdin().read_line(&mut buf);
    let mut a: i32 = buf.trim().parse().expect("Couldn't parse number");
    buf.clear();
    println!("Enter number b:");
    std::io::stdin().read_line(&mut buf);
    let mut b: i32 = buf.trim().parse().expect("Couldn't parse number");
    xor_swap(&mut a, &mut b);
    println!("After xor swap: a = {}, b = {}", a, b)
}
