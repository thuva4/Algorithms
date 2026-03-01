fn mobius_function(n: usize) -> i32 {
    if n == 0 {
        return 0;
    }

    let mut mu = vec![1i32; n + 1];
    let mut is_prime = vec![true; n + 1];
    mu[0] = 0;

    for i in 2..=n {
        if is_prime[i] {
            let mut j = i;
            while j <= n {
                is_prime[j] = false;
                mu[j] = -mu[j];
                j += i;
            }
            let i2 = i * i;
            let mut k = i2;
            while k <= n {
                mu[k] = 0;
                k += i2;
            }
        }
    }

    mu[1..].iter().sum()
}

fn main() {
    println!("{}", mobius_function(1));
    println!("{}", mobius_function(10));
    println!("{}", mobius_function(50));
}
