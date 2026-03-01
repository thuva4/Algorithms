pub fn power_of_two_check(n: i32) -> i32 {
    if n <= 0 {
        return 0;
    }
    if n & (n - 1) == 0 { 1 } else { 0 }
}
