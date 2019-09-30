extern crate num_complex;
use num_complex::Complex;
use std::str::FromStr;

#[allow(non_snake_case)]
fn ifft_rec(x: &mut [Complex<f32>]) {
    let N = x.len();
    let N2 = N / 2;
    if N <= 1 {
        return;
    }
    let mut even: Vec<_> = x.iter().step_by(2).map(Clone::clone).collect();
    let mut odds: Vec<_> = x.iter().skip(1).step_by(2).map(Clone::clone).collect();
    ifft_rec(&mut even);
    ifft_rec(&mut odds);
    for i in 0..N2 {
        let t = Complex::from_polar(&1., &(-std::f32::consts::PI * i as f32 / N2 as f32)) * odds[i];
        x[i] = even[i] + t;
        x[i + N2] = even[i] - t;
    }
}

fn ifft(x: &mut [Complex<f32>]) {
    let N = x.len() as f32;
    ifft_rec(x);
    for x in x.iter_mut() {
        *x /= N;
    }
}

fn main() {
    println!("Write your samples (one sample per line, x + yi format, end with empty line)");
    let mut v = Vec::new();
    let mut buffer = String::new();
    while let Ok(_) = std::io::stdin().read_line(&mut buffer) {
        buffer = buffer.trim().to_owned();
        v.push(match Complex::from_str(&buffer) {
            Ok(val) => val,
            Err(e) => {
                eprintln!("{}", e);
                break;
            }
        });
        buffer.clear()
    }
    ifft(&mut v);
    println!("ifft: {:?}", v);
}
