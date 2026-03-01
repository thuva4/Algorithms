pub fn luhn_check(number: &str) -> bool {
    let mut sum = 0i32;
    let mut double_digit = false;
    let digits: Vec<char> = number.chars().collect();

    if digits.is_empty() {
        return false;
    }

    for &ch in digits.iter().rev() {
        if !ch.is_ascii_digit() {
            return false;
        }
        let mut digit = (ch as u8 - b'0') as i32;
        if double_digit {
            digit *= 2;
            if digit > 9 {
                digit -= 9;
            }
        }
        sum += digit;
        double_digit = !double_digit;
    }

    sum % 10 == 0
}
