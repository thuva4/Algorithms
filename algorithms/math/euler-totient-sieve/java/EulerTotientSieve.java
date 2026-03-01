public class EulerTotientSieve {
    public static long eulerTotientSieve(int n) {
        int[] phi = new int[n + 1];
        for (int i = 0; i <= n; i++) phi[i] = i;
        for (int i = 2; i <= n; i++) {
            if (phi[i] == i) { // prime
                for (int j = i; j <= n; j += i) {
                    phi[j] -= phi[j] / i;
                }
            }
        }
        long sum = 0;
        for (int i = 1; i <= n; i++) sum += phi[i];
        return sum;
    }

    public static void main(String[] args) {
        System.out.println(eulerTotientSieve(1));
        System.out.println(eulerTotientSieve(10));
        System.out.println(eulerTotientSieve(100));
    }
}
