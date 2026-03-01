pub fn z_function(arr: &[i32]) -> Vec<i32> {
    let n = arr.len();
    let mut z = vec![0i32; n];
    let mut l: usize = 0;
    let mut r: usize = 0;
    for i in 1..n {
        if i < r {
            z[i] = ((r - i) as i32).min(z[i - l]);
        }
        while i + (z[i] as usize) < n && arr[z[i] as usize] == arr[i + z[i] as usize] {
            z[i] += 1;
        }
        if i + (z[i] as usize) > r {
            l = i;
            r = i + z[i] as usize;
        }
    }
    z
}
