pub fn simulated_annealing(arr: &[i32]) -> i32 {
    if arr.is_empty() {
        return 0;
    }
    if arr.len() == 1 {
        return arr[0];
    }

    let n = arr.len();
    let mut state: u64 = 42;

    let mut next_rand = || -> f64 {
        state = state.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
        (state >> 33) as f64 / (1u64 << 31) as f64
    };

    let mut current = 0usize;
    let mut best = 0usize;
    let mut temperature: f64 = 1000.0;
    let cooling_rate: f64 = 0.995;
    let min_temp: f64 = 0.01;

    while temperature > min_temp {
        let neighbor = ((next_rand() * n as f64) as usize).min(n - 1);
        let delta = arr[neighbor] - arr[current];

        if delta < 0 {
            current = neighbor;
        } else {
            let probability = (-delta as f64 / temperature).exp();
            if next_rand() < probability {
                current = neighbor;
            }
        }

        if arr[current] < arr[best] {
            best = current;
        }

        temperature *= cooling_rate;
    }

    arr[best]
}
