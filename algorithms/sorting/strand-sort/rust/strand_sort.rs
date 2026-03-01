pub fn strand_sort(arr: &mut [i32]) {
    if arr.len() <= 1 {
        return;
    }

    let mut list: Vec<i32> = arr.to_vec();
    let mut sorted: Vec<i32> = Vec::new();

    while !list.is_empty() {
        let mut strand: Vec<i32> = Vec::new();
        let mut remaining: Vec<i32> = Vec::new();

        strand.push(list.remove(0));

        for &item in &list {
            if item >= *strand.last().unwrap() {
                strand.push(item);
            } else {
                remaining.push(item);
            }
        }

        list = remaining;
        sorted = merge(sorted, strand);
    }

    arr.copy_from_slice(&sorted);
}

fn merge(sorted: Vec<i32>, strand: Vec<i32>) -> Vec<i32> {
    let mut result = Vec::with_capacity(sorted.len() + strand.len());
    let mut i = 0;
    let mut j = 0;

    while i < sorted.len() && j < strand.len() {
        if sorted[i] <= strand[j] {
            result.push(sorted[i]);
            i += 1;
        } else {
            result.push(strand[j]);
            j += 1;
        }
    }

    while i < sorted.len() {
        result.push(sorted[i]);
        i += 1;
    }

    while j < strand.len() {
        result.push(strand[j]);
        j += 1;
    }

    result
}
