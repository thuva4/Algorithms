fn discrete_logarithm(base: i64, target: i64, modulus: i64) -> i32 {
    if modulus <= 1 {
        return 0;
    }

    let mut value = 1i64.rem_euclid(modulus);
    let normalized_target = target.rem_euclid(modulus);
    for exponent in 0..=modulus {
        if value == normalized_target {
            return exponent as i32;
        }
        value = (value * base).rem_euclid(modulus);
    }

    -1
}

fn main() {
    println!("{}", discrete_logarithm(2, 8, 13));
    println!("{}", discrete_logarithm(5, 1, 7));
    println!("{}", discrete_logarithm(3, 3, 11));
    println!("{}", discrete_logarithm(3, 13, 17));
}
