pub fn longest_palindrome_subarray(arr: &[i32]) -> i32 {
    let n = arr.len();
    if n == 0 { return 0; }

    fn expand(arr: &[i32], mut l: isize, mut r: isize) -> i32 {
        let n = arr.len() as isize;
        while l >= 0 && r < n && arr[l as usize] == arr[r as usize] {
            l -= 1;
            r += 1;
        }
        (r - l - 1) as i32
    }

    let mut max_len = 1;
    for i in 0..n {
        let odd = expand(arr, i as isize, i as isize);
        let even = expand(arr, i as isize, (i + 1) as isize);
        max_len = max_len.max(odd).max(even);
    }
    max_len
}
