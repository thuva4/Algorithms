use std::cmp::Ordering;

fn binary_search(elements: &[u32], key: u32) -> Option<usize> {
    let mut low = 0;
    let mut high = elements.len();
    while low < high {
        let middle = (low + high) / 2;
        match elements[middle].cmp(&key) {
            Ordering::Less => low = middle + 1,
            Ordering::Greater => high = middle,
            Ordering::Equal => return Some(middle),
        }
    }

    None
}

fn main() {
    let elements = &[1, 2, 5, 10, 20];
    assert_eq!(binary_search(elements, 1), Some(0));
    assert_eq!(binary_search(elements, 2), Some(1));
    assert_eq!(binary_search(elements, 5), Some(2));
    assert_eq!(binary_search(elements, 10), Some(3));
    assert_eq!(binary_search(elements, 20), Some(4));
    assert_eq!(binary_search(elements, 6), None);
}

