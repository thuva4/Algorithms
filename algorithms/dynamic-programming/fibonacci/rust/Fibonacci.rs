const ITERS: usize = 20;

pub fn fibonacci(n: i32) -> i64 {
    if n <= 0 {
        return 0;
    }
    if n == 1 {
        return 1;
    }
    let mut a = 0i64;
    let mut b = 1i64;
    for _ in 2..=n {
        let next = a + b;
        a = b;
        b = next;
    }
    b
}

fn print_fib(n: usize) {
    let mut x = (1, 1);
    for i in 0..n {
        println!("{}: {}", i, x.0);
        x = (x.1, x.0 + x.1)
    }
}

fn main() {
    println!("# print_fib");
    print_fib(ITERS);
}
