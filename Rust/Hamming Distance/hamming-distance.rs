fn hamming_distance(str1: &str, str2: &str) -> Option<usize> {
    if str1.len() != str2.len() {
        return None;
    }
    Some(
        str1.chars()
            .zip(str2.chars())
            .fold(0, |acc, (c1, c2)| if c1 != c2 { acc + 1 } else { acc }),
    )
}

fn main() {
    let mut str1 = String::new();
    let mut str2 = String::new();
    println!("Enter a first string:");
    std::io::stdin().read_line(&mut str1);
    println!("Enter a second string:");
    std::io::stdin().read_line(&mut str2);
    match hamming_distance(&str1, &str2) {
        None => println!("String length mismatch: can't compute Hamming Distance"),
        Some(distance) => println!(
            "The hamming distance between these two strings is {}",
            distance
        ),
    }
}
