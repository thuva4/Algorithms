pub fn heap_sort_via_extract(arr: &[i32]) -> Vec<i32> {
    let mut heap: Vec<i32> = Vec::new();

    fn sift_up(heap: &mut Vec<i32>, mut i: usize) {
        while i > 0 {
            let parent = (i - 1) / 2;
            if heap[i] < heap[parent] {
                heap.swap(i, parent);
                i = parent;
            } else {
                break;
            }
        }
    }

    fn sift_down(heap: &mut Vec<i32>, mut i: usize, size: usize) {
        loop {
            let mut smallest = i;
            let left = 2 * i + 1;
            let right = 2 * i + 2;
            if left < size && heap[left] < heap[smallest] { smallest = left; }
            if right < size && heap[right] < heap[smallest] { smallest = right; }
            if smallest != i {
                heap.swap(i, smallest);
                i = smallest;
            } else {
                break;
            }
        }
    }

    for &val in arr {
        heap.push(val);
        let last_index = heap.len() - 1;
        sift_up(&mut heap, last_index);
    }

    let mut result = Vec::new();
    while !heap.is_empty() {
        result.push(heap[0]);
        let last = heap.len() - 1;
        heap[0] = heap[last];
        heap.pop();
        if !heap.is_empty() {
            let size = heap.len();
            sift_down(&mut heap, 0, size);
        }
    }

    result
}
