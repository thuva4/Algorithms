import java.util.PriorityQueue;

public class HuffmanCoding {

    public static int huffmanCoding(int[] frequencies) {
        if (frequencies.length <= 1) {
            return 0;
        }

        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        for (int freq : frequencies) {
            minHeap.add(freq);
        }

        int totalCost = 0;
        while (minHeap.size() > 1) {
            int left = minHeap.poll();
            int right = minHeap.poll();
            int merged = left + right;
            totalCost += merged;
            minHeap.add(merged);
        }

        return totalCost;
    }
}
