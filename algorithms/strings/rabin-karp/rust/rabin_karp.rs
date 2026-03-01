fn rabin_karp_search(text: &str, pattern: &str) -> i32 {
    let prime: i64 = 101;
    let base: i64 = 256;
    let txt: Vec<u8> = text.bytes().collect();
    let pat: Vec<u8> = pattern.bytes().collect();
    let n = txt.len();
    let m = pat.len();

    if m == 0 {
        return 0;
    }
    if m > n {
        return -1;
    }

    let mut pat_hash: i64 = 0;
    let mut txt_hash: i64 = 0;
    let mut h: i64 = 1;

    for _ in 0..m - 1 {
        h = (h * base) % prime;
    }

    for i in 0..m {
        pat_hash = (base * pat_hash + pat[i] as i64) % prime;
        txt_hash = (base * txt_hash + txt[i] as i64) % prime;
    }

    for i in 0..=n - m {
        if pat_hash == txt_hash {
            let mut matched = true;
            for j in 0..m {
                if txt[i + j] != pat[j] {
                    matched = false;
                    break;
                }
            }
            if matched {
                return i as i32;
            }
        }
        if i < n - m {
            txt_hash = (base * (txt_hash - txt[i] as i64 * h) + txt[i + m] as i64) % prime;
            if txt_hash < 0 {
                txt_hash += prime;
            }
        }
    }
    -1
}

fn main() {
    let text = "ABABDABACDABABCABAB";
    let pattern = "ABABCABAB";
    println!("Pattern found at index: {}", rabin_karp_search(text, pattern));
}
