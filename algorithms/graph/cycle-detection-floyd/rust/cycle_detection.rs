pub fn detect_cycle(arr: &[i32]) -> i32 {
    let size = arr.len() as i32;
    if size == 0 {
        return -1;
    }

    let mut tortoise = 0;
    let mut hare = 0;

    loop {
        if tortoise < 0 || tortoise >= size || arr[tortoise as usize] < 0 || arr[tortoise as usize] >= size {
            return -1;
        }
        tortoise = arr[tortoise as usize];

        if hare < 0 || hare >= size || arr[hare as usize] < 0 || arr[hare as usize] >= size {
            return -1;
        }
        hare = arr[hare as usize];
        if hare < 0 || hare >= size || arr[hare as usize] < 0 || arr[hare as usize] >= size {
            return -1;
        }
        hare = arr[hare as usize];

        if tortoise == hare {
            break;
        }
    }

    tortoise = 0;
    while tortoise != hare {
        tortoise = arr[tortoise as usize];
        hare = arr[hare as usize];
    }

    tortoise
}
