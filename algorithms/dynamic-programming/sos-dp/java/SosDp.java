import java.util.Scanner;

public class SosDp {
    public static int[] sosDp(int n, int[] f) {
        int size = 1 << n;
        int[] sos = new int[size];
        System.arraycopy(f, 0, sos, 0, size);

        for (int i = 0; i < n; i++) {
            for (int mask = 0; mask < size; mask++) {
                if ((mask & (1 << i)) != 0) {
                    sos[mask] += sos[mask ^ (1 << i)];
                }
            }
        }
        return sos;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int size = 1 << n;
        int[] f = new int[size];
        for (int i = 0; i < size; i++) f[i] = sc.nextInt();
        int[] result = sosDp(n, f);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < size; i++) {
            if (i > 0) sb.append(' ');
            sb.append(result[i]);
        }
        System.out.println(sb.toString());
    }
}
