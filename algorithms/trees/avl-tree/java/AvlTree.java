import java.util.ArrayList;
import java.util.List;

public class AvlTree {

    private static int[] keys;
    private static int[] lefts;
    private static int[] rights;
    private static int[] heights;
    private static int size;

    private static void init(int capacity) {
        keys = new int[capacity];
        lefts = new int[capacity];
        rights = new int[capacity];
        heights = new int[capacity];
        size = 0;
        for (int i = 0; i < capacity; i++) {
            lefts[i] = -1;
            rights[i] = -1;
        }
    }

    private static int newNode(int key) {
        int idx = size++;
        keys[idx] = key;
        lefts[idx] = -1;
        rights[idx] = -1;
        heights[idx] = 1;
        return idx;
    }

    private static int height(int node) {
        return node == -1 ? 0 : heights[node];
    }

    private static int balanceFactor(int node) {
        return node == -1 ? 0 : height(lefts[node]) - height(rights[node]);
    }

    private static void updateHeight(int node) {
        heights[node] = 1 + Math.max(height(lefts[node]), height(rights[node]));
    }

    private static int rotateRight(int y) {
        int x = lefts[y];
        int t2 = rights[x];
        rights[x] = y;
        lefts[y] = t2;
        updateHeight(y);
        updateHeight(x);
        return x;
    }

    private static int rotateLeft(int x) {
        int y = rights[x];
        int t2 = lefts[y];
        lefts[y] = x;
        rights[x] = t2;
        updateHeight(x);
        updateHeight(y);
        return y;
    }

    private static int insert(int node, int key) {
        if (node == -1) return newNode(key);
        if (key < keys[node]) lefts[node] = insert(lefts[node], key);
        else if (key > keys[node]) rights[node] = insert(rights[node], key);
        else return node;

        updateHeight(node);
        int bf = balanceFactor(node);

        if (bf > 1 && key < keys[lefts[node]]) return rotateRight(node);
        if (bf < -1 && key > keys[rights[node]]) return rotateLeft(node);
        if (bf > 1 && key > keys[lefts[node]]) {
            lefts[node] = rotateLeft(lefts[node]);
            return rotateRight(node);
        }
        if (bf < -1 && key < keys[rights[node]]) {
            rights[node] = rotateRight(rights[node]);
            return rotateLeft(node);
        }

        return node;
    }

    private static void inorder(int node, List<Integer> result) {
        if (node == -1) return;
        inorder(lefts[node], result);
        result.add(keys[node]);
        inorder(rights[node], result);
    }

    public static int[] avlInsertInorder(int[] arr) {
        init(arr.length + 1);
        int root = -1;
        for (int val : arr) {
            root = insert(root, val);
        }
        List<Integer> result = new ArrayList<>();
        inorder(root, result);
        return result.stream().mapToInt(Integer::intValue).toArray();
    }
}
