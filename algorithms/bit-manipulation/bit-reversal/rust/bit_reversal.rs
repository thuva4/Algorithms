pub fn bit_reversal(n: i64) -> i64 {
    let mut val = n as u32;
    let mut result: u32 = 0;
    for _ in 0..32 {
        result = (result << 1) | (val & 1);
        val >>= 1;
    }
    result as i64
}
