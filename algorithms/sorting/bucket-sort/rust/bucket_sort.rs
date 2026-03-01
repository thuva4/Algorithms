/**
 * Bucket Sort implementation.
 * Divides the input into several buckets, each of which is then sorted individually.
 */
pub fn bucket_sort(arr: &[i32]) -> Vec<i32> {
    if arr.len() <= 1 {
        return arr.to_vec();
    }

    let n = arr.len();
    let &min_val = arr.iter().min().unwrap();
    let &max_val = arr.iter().max().unwrap();

    if min_val == max_val {
        return arr.to_vec();
    }

    // Initialize buckets
    let mut buckets: Vec<Vec<i32>> = vec![Vec::new(); n];
    let range = (max_val as i64) - (min_val as i64);

    // Distribute elements into buckets
    for &x in arr {
        let index = (((x as i64) - (min_val as i64)) * ((n - 1) as i64) / range) as usize;
        buckets[index].push(x);
    }

    // Sort each bucket and merge
    let mut result = Vec::with_capacity(n);
    for mut bucket in buckets {
        if !bucket.is_empty() {
            bucket.sort_unstable();
            result.extend(bucket);
        }
    }

    result
}
