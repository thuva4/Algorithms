import java.util.*;

public class SkipList {
    private static final int MAX_LEVEL = 16;
    private static Random rng = new Random(42);

    static class Node {
        int key;
        Node[] forward;
        Node(int key, int level) {
            this.key = key;
            forward = new Node[level + 1];
        }
    }

    public static int[] skipList(int[] arr) {
        Node header = new Node(Integer.MIN_VALUE, MAX_LEVEL);
        int level = 0;

        for (int val : arr) {
            Node[] update = new Node[MAX_LEVEL + 1];
            Node current = header;
            for (int i = level; i >= 0; i--) {
                while (current.forward[i] != null && current.forward[i].key < val)
                    current = current.forward[i];
                update[i] = current;
            }
            current = current.forward[0];
            if (current != null && current.key == val) continue;

            int newLevel = 0;
            while (rng.nextBoolean() && newLevel < MAX_LEVEL) newLevel++;
            if (newLevel > level) {
                for (int i = level + 1; i <= newLevel; i++) update[i] = header;
                level = newLevel;
            }
            Node newNode = new Node(val, newLevel);
            for (int i = 0; i <= newLevel; i++) {
                newNode.forward[i] = update[i].forward[i];
                update[i].forward[i] = newNode;
            }
        }

        List<Integer> result = new ArrayList<>();
        Node node = header.forward[0];
        while (node != null) {
            result.add(node.key);
            node = node.forward[0];
        }
        return result.stream().mapToInt(Integer::intValue).toArray();
    }
}
