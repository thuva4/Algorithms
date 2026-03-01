fn mod_pow(mut base: u64, mut exp: u64, modulus: u64) -> u64 {
    let mut result = 1u64;
    base %= modulus;
    while exp > 0 {
        if exp & 1 == 1 {
            result = (result * base) % modulus;
        }
        exp >>= 1;
        base = (base * base) % modulus;
    }
    result
}

fn main() {
    let p: u64 = 23;
    let g: u64 = 5;
    let a: u64 = 6;
    let b: u64 = 15;

    let public_a = mod_pow(g, a, p);
    println!("Alice sends: {}", public_a);

    let public_b = mod_pow(g, b, p);
    println!("Bob sends: {}", public_b);

    let alice_secret = mod_pow(public_b, a, p);
    println!("Alice's shared secret: {}", alice_secret);

    let bob_secret = mod_pow(public_a, b, p);
    println!("Bob's shared secret: {}", bob_secret);
}
