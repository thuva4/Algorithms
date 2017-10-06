/*
 * Implementation of Insertion Sort in Rust
 */


fn insertion_sort(mut list: Vec<i32>) -> Vec<i32> {
    let mut i = 0;
    let mut j;
    while i < list.len() {
        j = i;
        while j > 0 && list[j-1] > list[j] {
            // Swap
            let s = list.remove(j-1);
            list.insert(j, s);
            j -= 1;
        }
        i += 1;
    }

    return list;
}
