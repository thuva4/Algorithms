use std::collections::VecDeque;

pub fn queue_ops(arr: &[i32]) -> i32 {
    if arr.is_empty() { return 0; }
    let mut queue: VecDeque<i32> = VecDeque::new();
    let op_count = arr[0] as usize;
    let mut idx = 1;
    let mut total: i32 = 0;
    for _ in 0..op_count {
        let t = arr[idx];
        let v = arr[idx + 1];
        idx += 2;
        if t == 1 { queue.push_back(v); }
        else if t == 2 {
            if let Some(val) = queue.pop_front() { total += val; }
        }
    }
    total
}
