fn sieve_of_eratosthenes(n: usize) -> Vec<usize> {
    if n < 2 {
        return vec![];
    }

    let mut is_prime = vec![true; n + 1];
    is_prime[0] = false;
    is_prime[1] = false;

    let mut i = 2;
    while i * i <= n {
        if is_prime[i] {
            let mut j = i * i;
            while j <= n {
                is_prime[j] = false;
                j += i;
            }
        }
        i += 1;
    }

    (2..=n).filter(|&x| is_prime[x]).collect()
}

fn main() {
    println!("Primes up to 30: {:?}", sieve_of_eratosthenes(30));
}
