pub fn postman_sort(arr: &mut [i32]) {
    if arr.is_empty() {
        return;
    }

    let min = *arr.iter().min().unwrap();
    let mut offset = 0;
    
    if min < 0 {
        offset = min.abs();
        for x in arr.iter_mut() {
            *x += offset;
        }
    }

    let max = *arr.iter().max().unwrap();
    let mut exp = 1;

    while max / exp > 0 {
        counting_sort(arr, exp);
        exp *= 10;
    }
    
    if offset > 0 {
        for x in arr.iter_mut() {
            *x -= offset;
        }
    }
}

fn counting_sort(arr: &mut [i32], exp: i32) {
    let n = arr.len();
    let mut output = vec![0; n];
    let mut count = [0; 10];

    for &x in arr.iter() {
        count[((x / exp) % 10) as usize] += 1;
    }

    for i in 1..10 {
        count[i] += count[i - 1];
    }

    for &x in arr.iter().rev() {
        let idx = ((x / exp) % 10) as usize;
        output[count[idx] - 1] = x;
        count[idx] -= 1;
    }

    arr.copy_from_slice(&output);
}
