pub fn detect_cycle(arr: &[i32]) -> i32 {
    let n = arr.len() as i32;
    if n == 0 {
        return -1;
    }

    let next_pos = |pos: i32| -> i32 {
        if pos < 0 || pos >= n || arr[pos as usize] == -1 {
            return -1;
        }
        arr[pos as usize]
    };

    let mut tortoise: i32 = 0;
    let mut hare: i32 = 0;

    // Phase 1: Detect cycle
    loop {
        tortoise = next_pos(tortoise);
        if tortoise == -1 {
            return -1;
        }

        hare = next_pos(hare);
        if hare == -1 {
            return -1;
        }
        hare = next_pos(hare);
        if hare == -1 {
            return -1;
        }

        if tortoise == hare {
            break;
        }
    }

    // Phase 2: Find cycle start
    let mut pointer1: i32 = 0;
    let mut pointer2: i32 = tortoise;
    while pointer1 != pointer2 {
        pointer1 = arr[pointer1 as usize];
        pointer2 = arr[pointer2 as usize];
    }

    pointer1
}
