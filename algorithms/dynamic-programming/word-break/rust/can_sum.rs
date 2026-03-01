/// Determine if target can be formed by summing elements from arr
/// with repetition allowed.
///
/// # Arguments
/// * `arr` - slice of positive integers (available elements)
/// * `target` - the target sum to reach
///
/// # Returns
/// 1 if target is achievable, 0 otherwise
pub fn can_sum(arr: &[i32], target: i32) -> i32 {
    if target == 0 {
        return 1;
    }

    let t = target as usize;
    let mut dp = vec![false; t + 1];
    dp[0] = true;

    for i in 1..=t {
        for &elem in arr {
            let e = elem as usize;
            if e <= i && dp[i - e] {
                dp[i] = true;
                break;
            }
        }
    }

    if dp[t] { 1 } else { 0 }
}

fn main() {
    println!("{}", can_sum(&[2, 3], 7));   // 1
    println!("{}", can_sum(&[5, 3], 8));   // 1
    println!("{}", can_sum(&[2, 4], 7));   // 0
    println!("{}", can_sum(&[1], 5));      // 1
    println!("{}", can_sum(&[7], 3));      // 0
}
