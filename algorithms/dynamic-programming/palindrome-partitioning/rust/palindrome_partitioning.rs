pub fn palindrome_partitioning(arr: &[i32]) -> i32 {
    let n = arr.len();
    if n <= 1 { return 0; }

    let mut is_pal = vec![vec![false; n]; n];
    for i in 0..n { is_pal[i][i] = true; }
    for i in 0..n-1 { is_pal[i][i+1] = arr[i] == arr[i+1]; }
    for len in 3..=n {
        for i in 0..=n-len {
            let j = i + len - 1;
            is_pal[i][j] = arr[i] == arr[j] && is_pal[i+1][j-1];
        }
    }

    let mut cuts = vec![0i32; n];
    for i in 0..n {
        if is_pal[0][i] { cuts[i] = 0; continue; }
        cuts[i] = i as i32;
        for j in 1..=i {
            if is_pal[j][i] && cuts[j-1] + 1 < cuts[i] { cuts[i] = cuts[j-1] + 1; }
        }
    }
    cuts[n-1]
}

fn main() {
    println!("{}", palindrome_partitioning(&[1, 2, 1]));
    println!("{}", palindrome_partitioning(&[1, 2, 3, 2]));
    println!("{}", palindrome_partitioning(&[1, 2, 3]));
    println!("{}", palindrome_partitioning(&[5]));
}
