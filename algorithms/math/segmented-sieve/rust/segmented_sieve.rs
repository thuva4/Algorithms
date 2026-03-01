fn simple_primes(limit: usize) -> Vec<usize> {
    if limit < 2 {
        return Vec::new();
    }

    let mut sieve = vec![true; limit + 1];
    sieve[0] = false;
    sieve[1] = false;
    let mut factor = 2usize;
    while factor * factor <= limit {
        if sieve[factor] {
            let mut multiple = factor * factor;
            while multiple <= limit {
                sieve[multiple] = false;
                multiple += factor;
            }
        }
        factor += 1;
    }

    sieve
        .iter()
        .enumerate()
        .filter_map(|(index, &is_prime)| if is_prime { Some(index) } else { None })
        .collect()
}

pub fn segmented_sieve(low: i64, high: i64) -> Vec<i64> {
    if high < 2 || low > high {
        return Vec::new();
    }

    let start = low.max(2) as usize;
    let end = high as usize;
    let size = end - start + 1;
    let mut is_prime = vec![true; size];
    let limit = (high as f64).sqrt().floor() as usize;

    for prime in simple_primes(limit) {
        let mut multiple = start.div_ceil(prime) * prime;
        if multiple < prime * prime {
            multiple = prime * prime;
        }
        while multiple <= end {
            is_prime[multiple - start] = false;
            multiple += prime;
        }
    }

    is_prime
        .iter()
        .enumerate()
        .filter_map(|(index, &prime)| if prime { Some((start + index) as i64) } else { None })
        .collect()
}
