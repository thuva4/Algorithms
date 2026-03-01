import java.util.ArrayList;
import java.util.List;

public class ConvexHullJarvis {

    public static int convexHullJarvis(int[] arr) {
        int n = arr[0];
        if (n < 2) return n;

        int[] px = new int[n], py = new int[n];
        for (int i = 0; i < n; i++) {
            px[i] = arr[1 + 2 * i];
            py[i] = arr[1 + 2 * i + 1];
        }

        int start = 0;
        for (int i = 1; i < n; i++) {
            if (px[i] < px[start] || (px[i] == px[start] && py[i] < py[start]))
                start = i;
        }

        List<Integer> hull = new ArrayList<>();
        int current = start;
        do {
            hull.add(current);
            int candidate = 0;
            for (int i = 1; i < n; i++) {
                if (i == current) continue;
                if (candidate == current) { candidate = i; continue; }
                int c = cross(px[current], py[current], px[candidate], py[candidate], px[i], py[i]);
                if (c < 0) {
                    candidate = i;
                } else if (c == 0) {
                    if (distSq(px[current], py[current], px[i], py[i]) >
                        distSq(px[current], py[current], px[candidate], py[candidate]))
                        candidate = i;
                }
            }
            current = candidate;
        } while (current != start);

        return hull.size();
    }

    private static int cross(int ox, int oy, int ax, int ay, int bx, int by) {
        return (ax - ox) * (by - oy) - (ay - oy) * (bx - ox);
    }

    private static int distSq(int ax, int ay, int bx, int by) {
        return (ax - bx) * (ax - bx) + (ay - by) * (ay - by);
    }
}
