public class LineIntersection {

    public static int lineIntersection(int[] arr) {
        int x1 = arr[0], y1 = arr[1], x2 = arr[2], y2 = arr[3];
        int x3 = arr[4], y3 = arr[5], x4 = arr[6], y4 = arr[7];

        int o1 = orientation(x1, y1, x2, y2, x3, y3);
        int o2 = orientation(x1, y1, x2, y2, x4, y4);
        int o3 = orientation(x3, y3, x4, y4, x1, y1);
        int o4 = orientation(x3, y3, x4, y4, x2, y2);

        if (o1 != o2 && o3 != o4) return 1;

        if (o1 == 0 && onSegment(x1, y1, x3, y3, x2, y2)) return 1;
        if (o2 == 0 && onSegment(x1, y1, x4, y4, x2, y2)) return 1;
        if (o3 == 0 && onSegment(x3, y3, x1, y1, x4, y4)) return 1;
        if (o4 == 0 && onSegment(x3, y3, x2, y2, x4, y4)) return 1;

        return 0;
    }

    private static int orientation(int px, int py, int qx, int qy, int rx, int ry) {
        int val = (qy - py) * (rx - qx) - (qx - px) * (ry - qy);
        if (val == 0) return 0;
        return val > 0 ? 1 : 2;
    }

    private static boolean onSegment(int px, int py, int qx, int qy, int rx, int ry) {
        return qx <= Math.max(px, rx) && qx >= Math.min(px, rx) &&
               qy <= Math.max(py, ry) && qy >= Math.min(py, ry);
    }
}
