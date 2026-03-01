int josephus(int n, int k) {
    if (n <= 0 || k <= 0) {
        return -1;
    }

    int survivor = 0;
    for (int size = 2; size <= n; ++size) {
        survivor = (survivor + k) % size;
    }
    return survivor;
}
