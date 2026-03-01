import java.util.HashMap;
import java.util.Map;

public class LruCache {

    private static class Node {
        int key, value;
        Node prev, next;

        Node(int key, int value) {
            this.key = key;
            this.value = value;
        }
    }

    private final int capacity;
    private final Map<Integer, Node> map;
    private final Node head;
    private final Node tail;

    private LruCache(int capacity) {
        this.capacity = capacity;
        this.map = new HashMap<>();
        this.head = new Node(0, 0);
        this.tail = new Node(0, 0);
        head.next = tail;
        tail.prev = head;
    }

    private void remove(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void addToHead(Node node) {
        node.next = head.next;
        node.prev = head;
        head.next.prev = node;
        head.next = node;
    }

    private int get(int key) {
        if (map.containsKey(key)) {
            Node node = map.get(key);
            remove(node);
            addToHead(node);
            return node.value;
        }
        return -1;
    }

    private void put(int key, int value) {
        if (map.containsKey(key)) {
            Node node = map.get(key);
            node.value = value;
            remove(node);
            addToHead(node);
        } else {
            if (map.size() == capacity) {
                Node lru = tail.prev;
                remove(lru);
                map.remove(lru.key);
            }
            Node node = new Node(key, value);
            map.put(key, node);
            addToHead(node);
        }
    }

    public static int lruCache(int[] operations) {
        int capacity = operations[0];
        int opCount = operations[1];
        LruCache cache = new LruCache(capacity);
        int resultSum = 0;
        int idx = 2;

        for (int i = 0; i < opCount; i++) {
            int opType = operations[idx];
            int key = operations[idx + 1];
            int value = operations[idx + 2];
            idx += 3;

            if (opType == 1) {
                cache.put(key, value);
            } else if (opType == 2) {
                resultSum += cache.get(key);
            }
        }

        return resultSum;
    }
}
