use std::cmp::min;

pub fn fibonacci_search(arr: &[i32], target: i32) -> i32 {
    let n = arr.len();
    if n == 0 {
        return -1;
    }

    let mut fib_m_m2 = 0;
    let mut fib_m_m1 = 1;
    let mut fib_m = fib_m_m2 + fib_m_m1;

    while fib_m < n {
        fib_m_m2 = fib_m_m1;
        fib_m_m1 = fib_m;
        fib_m = fib_m_m2 + fib_m_m1;
    }

    let mut offset = -1isize;

    while fib_m > 1 {
        let i = min((offset + fib_m_m2 as isize) as usize, n - 1);

        if arr[i] < target {
            fib_m = fib_m_m1;
            fib_m_m1 = fib_m_m2;
            fib_m_m2 = fib_m - fib_m_m1;
            offset = i as isize;
        } else if arr[i] > target {
            fib_m = fib_m_m2;
            fib_m_m1 = fib_m_m1 - fib_m_m2;
            fib_m_m2 = fib_m - fib_m_m1;
        } else {
            return i as i32;
        }
    }

    if fib_m_m1 == 1 && (offset + 1) < n as isize && arr[(offset + 1) as usize] == target {
        return (offset + 1) as i32;
    }

    -1
}
