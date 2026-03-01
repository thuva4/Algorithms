pub fn longest_palindrome_length(arr: &[i32]) -> i32 {
    if arr.is_empty() { return 0; }

    let mut t = vec![-1i32];
    for &x in arr {
        t.push(x);
        t.push(-1);
    }

    let n = t.len();
    let mut p = vec![0usize; n];
    let mut c: usize = 0;
    let mut r: usize = 0;
    let mut max_len: usize = 0;

    for i in 0..n {
        let mirror = if i >= c { 2 * c.wrapping_sub(0) } else { 0 };
        let mirror = (2 * c).wrapping_sub(i);
        if i < r && mirror < n {
            p[i] = (r - i).min(p[mirror]);
        }
        while i + p[i] + 1 < n && (i as isize - p[i] as isize - 1) >= 0
            && t[i + p[i] + 1] == t[i - p[i] - 1] {
            p[i] += 1;
        }
        if i + p[i] > r { c = i; r = i + p[i]; }
        if p[i] > max_len { max_len = p[i]; }
    }

    max_len as i32
}
