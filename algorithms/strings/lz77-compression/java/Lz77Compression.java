public class Lz77Compression {

    public static int lz77Compression(int[] arr) {
        int n = arr.length;
        int windowSize = 256;
        int count = 0, i = 0;

        while (i < n) {
            int bestLen = 0;
            int start = Math.max(0, i - windowSize);
            for (int j = start; j < i; j++) {
                int len = 0;
                int dist = i - j;
                while (i + len < n && len < dist && arr[j + len] == arr[i + len]) len++;
                if (len == dist) {
                    while (i + len < n && arr[j + (len % dist)] == arr[i + len]) len++;
                }
                if (len > bestLen) bestLen = len;
            }
            if (bestLen >= 2) { count++; i += bestLen; }
            else i++;
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println(lz77Compression(new int[]{1, 2, 3, 1, 2, 3}));
        System.out.println(lz77Compression(new int[]{5, 5, 5, 5}));
        System.out.println(lz77Compression(new int[]{1, 2, 3, 4}));
        System.out.println(lz77Compression(new int[]{1, 2, 1, 2, 3, 4, 3, 4}));
    }
}
