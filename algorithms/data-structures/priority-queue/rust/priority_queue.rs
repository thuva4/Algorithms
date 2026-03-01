pub fn priority_queue_ops(arr: &[i32]) -> i32 {
    if arr.is_empty() { return 0; }

    let mut heap: Vec<i32> = Vec::new();
    let op_count = arr[0] as usize;
    let mut idx = 1;
    let mut total: i32 = 0;

    fn sift_up(heap: &mut Vec<i32>, mut i: usize) {
        while i > 0 {
            let p = (i - 1) / 2;
            if heap[i] < heap[p] { heap.swap(i, p); i = p; }
            else { break; }
        }
    }

    fn sift_down(heap: &mut Vec<i32>, mut i: usize) {
        let sz = heap.len();
        loop {
            let mut s = i;
            let l = 2 * i + 1;
            let r = 2 * i + 2;
            if l < sz && heap[l] < heap[s] { s = l; }
            if r < sz && heap[r] < heap[s] { s = r; }
            if s != i { heap.swap(i, s); i = s; }
            else { break; }
        }
    }

    for _ in 0..op_count {
        let t = arr[idx];
        let v = arr[idx + 1];
        idx += 2;
        if t == 1 {
            heap.push(v);
            let last_index = heap.len() - 1;
            sift_up(&mut heap, last_index);
        } else if t == 2 {
            if heap.is_empty() { continue; }
            total += heap[0];
            let last = heap.len() - 1;
            heap[0] = heap[last];
            heap.pop();
            if !heap.is_empty() { sift_down(&mut heap, 0); }
        }
    }
    total
}
