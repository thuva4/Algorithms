pub fn wildcard_matching(arr: &[i32]) -> i32 {
    let mut idx = 0;
    let tlen = arr[idx] as usize; idx += 1;
    let text = &arr[idx..idx+tlen]; idx += tlen;
    let plen = arr[idx] as usize; idx += 1;
    let pattern = &arr[idx..idx+plen];

    let mut dp = vec![vec![false; plen+1]; tlen+1];
    dp[0][0] = true;
    for j in 1..=plen { if pattern[j-1] == 0 { dp[0][j] = dp[0][j-1]; } }

    for i in 1..=tlen {
        for j in 1..=plen {
            if pattern[j-1] == 0 { dp[i][j] = dp[i-1][j] || dp[i][j-1]; }
            else if pattern[j-1] == -1 || pattern[j-1] == text[i-1] { dp[i][j] = dp[i-1][j-1]; }
        }
    }
    if dp[tlen][plen] { 1 } else { 0 }
}

fn main() {
    println!("{}", wildcard_matching(&[3, 1, 2, 3, 3, 1, 2, 3]));
    println!("{}", wildcard_matching(&[3, 1, 2, 3, 1, 0]));
    println!("{}", wildcard_matching(&[3, 1, 2, 3, 3, 1, -1, 3]));
    println!("{}", wildcard_matching(&[2, 1, 2, 2, 3, 4]));
    println!("{}", wildcard_matching(&[0, 1, 0]));
}
