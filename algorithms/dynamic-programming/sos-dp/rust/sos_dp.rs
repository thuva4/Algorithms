use std::io::{self, Read};

fn sos_dp(n: usize, f: &[i64]) -> Vec<i64> {
    let size = 1 << n;
    let mut sos: Vec<i64> = f.to_vec();

    for i in 0..n {
        for mask in 0..size {
            if mask & (1 << i) != 0 {
                sos[mask] += sos[mask ^ (1 << i)];
            }
        }
    }
    sos
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut iter = input.split_whitespace();
    let n: usize = iter.next().unwrap().parse().unwrap();
    let size = 1 << n;
    let f: Vec<i64> = (0..size).map(|_| iter.next().unwrap().parse().unwrap()).collect();
    let result = sos_dp(n, &f);
    let strs: Vec<String> = result.iter().map(|x| x.to_string()).collect();
    println!("{}", strs.join(" "));
}
