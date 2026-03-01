fn compute_lps(pattern: &str) -> Vec<usize> {
    let pat: Vec<char> = pattern.chars().collect();
    let m = pat.len();
    let mut lps = vec![0usize; m];
    let mut len = 0;
    let mut i = 1;

    while i < m {
        if pat[i] == pat[len] {
            len += 1;
            lps[i] = len;
            i += 1;
        } else if len != 0 {
            len = lps[len - 1];
        } else {
            lps[i] = 0;
            i += 1;
        }
    }
    lps
}

fn kmp_search(text: &str, pattern: &str) -> i32 {
    let n = text.len();
    let m = pattern.len();

    if m == 0 {
        return 0;
    }

    let txt: Vec<char> = text.chars().collect();
    let pat: Vec<char> = pattern.chars().collect();
    let lps = compute_lps(pattern);

    let mut i = 0;
    let mut j = 0;
    while i < n {
        if pat[j] == txt[i] {
            i += 1;
            j += 1;
        }
        if j == m {
            return (i - j) as i32;
        } else if i < n && pat[j] != txt[i] {
            if j != 0 {
                j = lps[j - 1];
            } else {
                i += 1;
            }
        }
    }
    -1
}

fn main() {
    let text = "ABABDABACDABABCABAB";
    let pattern = "ABABCABAB";
    println!("Pattern found at index: {}", kmp_search(text, pattern));
}
