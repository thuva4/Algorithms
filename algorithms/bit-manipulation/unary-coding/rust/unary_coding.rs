fn unary_encode(n: usize) -> String {
    "1".repeat(n) + "0"
}

fn main() {
    println!("Unary encoding of 0: {}", unary_encode(0));
    println!("Unary encoding of 3: {}", unary_encode(3));
    println!("Unary encoding of 5: {}", unary_encode(5));
}
