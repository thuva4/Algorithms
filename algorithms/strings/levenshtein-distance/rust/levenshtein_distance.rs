/// Compute the Levenshtein (edit) distance between two sequences.
///
/// Input format: [len1, seq1..., len2, seq2...]
///
/// # Returns
/// Minimum number of single-element edits (insert, delete, substitute)
pub fn levenshtein_distance(arr: &[i32]) -> i32 {
    let mut idx = 0;
    let len1 = arr[idx] as usize; idx += 1;
    let seq1 = &arr[idx..idx + len1]; idx += len1;
    let len2 = arr[idx] as usize; idx += 1;
    let seq2 = &arr[idx..idx + len2];

    let mut dp = vec![vec![0i32; len2 + 1]; len1 + 1];

    for i in 0..=len1 { dp[i][0] = i as i32; }
    for j in 0..=len2 { dp[0][j] = j as i32; }

    for i in 1..=len1 {
        for j in 1..=len2 {
            if seq1[i - 1] == seq2[j - 1] {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + dp[i - 1][j].min(dp[i][j - 1]).min(dp[i - 1][j - 1]);
            }
        }
    }

    dp[len1][len2]
}

fn main() {
    println!("{}", levenshtein_distance(&[3, 1, 2, 3, 3, 1, 2, 4])); // 1
    println!("{}", levenshtein_distance(&[2, 5, 6, 2, 5, 6]));       // 0
    println!("{}", levenshtein_distance(&[2, 1, 2, 2, 3, 4]));       // 2
    println!("{}", levenshtein_distance(&[0, 3, 1, 2, 3]));          // 3
}
