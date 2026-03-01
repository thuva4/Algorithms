public class FloydWarshall {
    public static double[][] floydWarshall(Object[][] distanceMatrix) {
        int n = distanceMatrix.length;
        double[][] dist = new double[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                dist[i][j] = toDistance(distanceMatrix[i][j]);
            }
        }

        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    double via = dist[i][k] + dist[k][j];
                    if (via < dist[i][j]) {
                        dist[i][j] = via;
                    }
                }
            }
        }
        return dist;
    }

    private static double toDistance(Object value) {
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        if ("Infinity".equals(String.valueOf(value))) {
            return Double.POSITIVE_INFINITY;
        }
        if ("-Infinity".equals(String.valueOf(value))) {
            return Double.NEGATIVE_INFINITY;
        }
        return Double.parseDouble(String.valueOf(value));
    }
}
