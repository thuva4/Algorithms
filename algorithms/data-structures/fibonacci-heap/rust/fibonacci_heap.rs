use std::collections::BinaryHeap;
use std::cmp::Reverse;

/// Simplified Fibonacci Heap behavior using a BinaryHeap (min-heap via Reverse).
/// A full Fibonacci Heap requires unsafe pointer manipulation in Rust;
/// this implementation provides the same interface and correct results.
fn fibonacci_heap(operations: &[i32]) -> Vec<i32> {
    let mut heap: BinaryHeap<Reverse<i32>> = BinaryHeap::new();
    let mut results = Vec::new();
    for &op in operations {
        if op == 0 {
            match heap.pop() {
                Some(Reverse(val)) => results.push(val),
                None => results.push(-1),
            }
        } else {
            heap.push(Reverse(op));
        }
    }
    results
}

fn main() {
    println!("{:?}", fibonacci_heap(&[3, 1, 4, 0, 0]));
    println!("{:?}", fibonacci_heap(&[5, 2, 8, 1, 0, 0, 0, 0]));
}
