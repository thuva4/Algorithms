package algorithms.sorting.strand;

import java.util.Iterator;
import java.util.LinkedList;

public class StrandSort {
    public static void sort(int[] arr) {
        if (arr == null || arr.length <= 1) return;

        LinkedList<Integer> list = new LinkedList<>();
        for (int i : arr) list.add(i);

        LinkedList<Integer> sorted = new LinkedList<>();

        while (!list.isEmpty()) {
            LinkedList<Integer> strand = new LinkedList<>();
            strand.add(list.removeFirst());

            Iterator<Integer> it = list.iterator();
            while (it.hasNext()) {
                int val = it.next();
                if (val >= strand.getLast()) {
                    strand.add(val);
                    it.remove();
                }
            }

            sorted = merge(sorted, strand);
        }

        int i = 0;
        for (int val : sorted) {
            arr[i++] = val;
        }
    }

    private static LinkedList<Integer> merge(LinkedList<Integer> sorted, LinkedList<Integer> strand) {
        LinkedList<Integer> result = new LinkedList<>();
        while (!sorted.isEmpty() && !strand.isEmpty()) {
            if (sorted.getFirst() <= strand.getFirst()) {
                result.add(sorted.removeFirst());
            } else {
                result.add(strand.removeFirst());
            }
        }
        result.addAll(sorted);
        result.addAll(strand);
        return result;
    }
}
