fun josephus(n: Int, k: Int): Int {
    var survivor = 0
    for (size in 1..n) {
        survivor = (survivor + k) % size
    }
    return survivor
}
