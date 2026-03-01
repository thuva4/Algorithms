use std::cmp;

/// Find the length of the longest contiguous subarray common to both slices.
///
/// # Arguments
/// * `arr1` - first slice of integers
/// * `arr2` - second slice of integers
///
/// # Returns
/// Length of the longest common contiguous subarray
pub fn longest_common_substring(arr1: &[i32], arr2: &[i32]) -> i32 {
    let n = arr1.len();
    let m = arr2.len();
    let mut max_len = 0;

    let mut dp = vec![vec![0; m + 1]; n + 1];

    for i in 1..=n {
        for j in 1..=m {
            if arr1[i - 1] == arr2[j - 1] {
                dp[i][j] = dp[i - 1][j - 1] + 1;
                max_len = cmp::max(max_len, dp[i][j]);
            } else {
                dp[i][j] = 0;
            }
        }
    }

    max_len
}

fn main() {
    println!("{}", longest_common_substring(&[1, 2, 3, 4, 5], &[3, 4, 5, 6, 7]));  // 3
    println!("{}", longest_common_substring(&[1, 2, 3], &[4, 5, 6]));                // 0
    println!("{}", longest_common_substring(&[1, 2, 3, 4], &[1, 2, 3, 4]));          // 4
    println!("{}", longest_common_substring(&[1], &[1]));                             // 1
    println!("{}", longest_common_substring(&[1, 2, 3, 2, 1], &[3, 2, 1, 4, 7]));   // 3
}
