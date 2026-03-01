use std::collections::BinaryHeap;
use std::cmp::Reverse;

pub fn huffman_coding(frequencies: &[i32]) -> i32 {
    if frequencies.len() <= 1 {
        return 0;
    }

    let mut min_heap: BinaryHeap<Reverse<i32>> = frequencies
        .iter()
        .map(|&f| Reverse(f))
        .collect();

    let mut total_cost = 0;
    while min_heap.len() > 1 {
        let Reverse(left) = min_heap.pop().unwrap();
        let Reverse(right) = min_heap.pop().unwrap();
        let merged = left + right;
        total_cost += merged;
        min_heap.push(Reverse(merged));
    }

    total_cost
}
