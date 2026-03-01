fn count_inversions(arr: &mut [i32]) -> usize {
    let n = arr.len();
    if n <= 1 {
        return 0;
    }
    let mid = n / 2;
    let mut left = arr[..mid].to_vec();
    let mut right = arr[mid..].to_vec();

    let mut inv = count_inversions(&mut left);
    inv += count_inversions(&mut right);

    let mut i = 0;
    let mut j = 0;
    let mut k = 0;

    while i < left.len() && j < right.len() {
        if left[i] <= right[j] {
            arr[k] = left[i];
            i += 1;
        } else {
            arr[k] = right[j];
            inv += left.len() - i;
            j += 1;
        }
        k += 1;
    }
    while i < left.len() {
        arr[k] = left[i];
        i += 1;
        k += 1;
    }
    while j < right.len() {
        arr[k] = right[j];
        j += 1;
        k += 1;
    }
    inv
}

fn main() {
    let mut arr = vec![2, 4, 1, 3, 5];
    let inversions = count_inversions(&mut arr);
    println!("Number of inversions: {}", inversions);
}
