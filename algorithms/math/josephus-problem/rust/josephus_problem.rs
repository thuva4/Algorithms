pub fn josephus(n: i64, k: i64) -> i64 {
    let mut survivor = 0i64;
    for size in 1..=n.max(0) {
        survivor = (survivor + k) % size;
    }
    survivor
}
