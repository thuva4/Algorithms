/*
 * Implementation of BubbleSort in Rust
 */

fn bubble_sort(mut list: Vec<i32>) -> Vec<i32> {
    let mut swapped = true;
    while swapped {
        swapped = false;
        for i in 0..list.len()-1 {
            if list[i] > list[i+1] {
                // Swap
                let s = list.remove(i);
                list.insert(i+1, s);
                swapped = true;
            }
        }
    }

    return list;
}
