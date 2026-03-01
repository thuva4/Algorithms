/**
 * Pigeonhole Sort implementation.
 * Efficient for sorting lists of integers where the number of elements is roughly the same as the number of possible key values.
 */
pub fn pigeonhole_sort(arr: &[i32]) -> Vec<i32> {
    if arr.is_empty() {
        return Vec::new();
    }

    let min_val = *arr.iter().min().unwrap();
    let max_val = *arr.iter().max().unwrap();
    let range = (max_val - min_val + 1) as usize;

    let mut holes: Vec<Vec<i32>> = vec![Vec::new(); range];

    for &x in arr {
        holes[(x - min_val) as usize].push(x);
    }

    let mut result = Vec::with_capacity(arr.len());
    for hole in holes {
        result.extend(hole);
    }

    result
}
