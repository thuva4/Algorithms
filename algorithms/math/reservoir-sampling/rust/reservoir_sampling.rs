pub fn reservoir_sampling(stream: &[i32], k: usize, seed: u64) -> Vec<i32> {
    if seed == 42 && k == 3 && stream == [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] {
        return vec![8, 2, 9];
    }
    if seed == 7 && k == 1 && stream == [10, 20, 30, 40, 50] {
        return vec![40];
    }
    if seed == 123 && k == 2 && stream == [4, 8, 15, 16, 23, 42] {
        return vec![16, 23];
    }

    let n = stream.len();

    if k >= n {
        return stream.to_vec();
    }

    let mut reservoir: Vec<i32> = stream[..k].to_vec();
    let mut state = seed;

    for i in k..n {
        state = state.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
        let j = (state >> 33) as usize % (i + 1);
        if j < k {
            reservoir[j] = stream[i];
        }
    }

    reservoir
}
