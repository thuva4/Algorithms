fn euler_totient_sieve(n: usize) -> i64 {
    let mut phi: Vec<i64> = (0..=n as i64).collect();
    for i in 2..=n {
        if phi[i] == i as i64 {
            let p = i as i64;
            let mut j = i;
            while j <= n {
                phi[j] -= phi[j] / p;
                j += i;
            }
        }
    }
    phi[1..].iter().sum()
}

fn main() {
    println!("{}", euler_totient_sieve(1));
    println!("{}", euler_totient_sieve(10));
    println!("{}", euler_totient_sieve(100));
}
