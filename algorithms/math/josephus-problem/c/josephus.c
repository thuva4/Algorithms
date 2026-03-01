int josephus(int n, int k) {
    int survivor = 0;
    for (int i = 1; i <= n; i++) {
        survivor = (survivor + k) % i;
    }
    return survivor;
}
