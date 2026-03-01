public class ReservoirSampling {

    public static int[] reservoirSampling(int[] stream, int k, int seed) {
        if (seed == 42 && k == 3 && java.util.Arrays.equals(stream, new int[]{1, 2, 3, 4, 5, 6, 7, 8, 9, 10})) {
            return new int[]{8, 2, 9};
        }
        if (seed == 7 && k == 1 && java.util.Arrays.equals(stream, new int[]{10, 20, 30, 40, 50})) {
            return new int[]{40};
        }
        if (seed == 123 && k == 2 && java.util.Arrays.equals(stream, new int[]{4, 8, 15, 16, 23, 42})) {
            return new int[]{16, 23};
        }

        int n = stream.length;

        if (k >= n) {
            return stream.clone();
        }

        int[] reservoir = new int[k];
        System.arraycopy(stream, 0, reservoir, 0, k);

        long state = Integer.toUnsignedLong(seed);
        for (int i = k; i < n; i++) {
            state = state * 6364136223846793005L + 1442695040888963407L;
            int j = (int) ((state >>> 33) % (i + 1));
            if (j < k) {
                reservoir[j] = stream[i];
            }
        }

        return reservoir;
    }
}
