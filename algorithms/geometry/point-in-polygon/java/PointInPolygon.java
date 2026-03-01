public class PointInPolygon {

    public static int pointInPolygon(int[] arr) {
        int px = arr[0], py = arr[1];
        int n = arr[2];
        int[] polyX = new int[n], polyY = new int[n];
        for (int i = 0; i < n; i++) {
            polyX[i] = arr[3 + 2 * i];
            polyY[i] = arr[3 + 2 * i + 1];
        }

        boolean inside = false;
        int j = n - 1;
        for (int i = 0; i < n; i++) {
            if ((polyY[i] > py) != (polyY[j] > py) &&
                px < (double)(polyX[j] - polyX[i]) * (py - polyY[i]) / (polyY[j] - polyY[i]) + polyX[i]) {
                inside = !inside;
            }
            j = i;
        }

        return inside ? 1 : 0;
    }
}
