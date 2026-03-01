fn hamming_distance(a: i32, b: i32) -> u32 {
    (a ^ b).count_ones()
}

fn main() {
    println!("Hamming distance between 1 and 4: {}", hamming_distance(1, 4));
    println!("Hamming distance between 7 and 8: {}", hamming_distance(7, 8));
    println!("Hamming distance between 93 and 73: {}", hamming_distance(93, 73));
}
