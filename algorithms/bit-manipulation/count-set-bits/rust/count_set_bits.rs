pub fn count_set_bits(arr: &[i32]) -> i32 {
    let mut total = 0;
    for &num in arr {
        let mut n = num;
        while n != 0 {
            total += 1;
            n &= n - 1;
        }
    }
    total
}
