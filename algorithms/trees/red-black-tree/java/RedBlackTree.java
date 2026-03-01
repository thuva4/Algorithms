import java.util.ArrayList;
import java.util.List;

public class RedBlackTree {

    private static final boolean RED = true;
    private static final boolean BLACK = false;

    private static int[] keys;
    private static int[] lefts;
    private static int[] rights;
    private static int[] parents;
    private static boolean[] colors;
    private static int size;
    private static int root;

    private static void init(int capacity) {
        keys = new int[capacity];
        lefts = new int[capacity];
        rights = new int[capacity];
        parents = new int[capacity];
        colors = new boolean[capacity];
        size = 0;
        root = -1;
    }

    private static int newNode(int key) {
        int idx = size++;
        keys[idx] = key;
        lefts[idx] = -1;
        rights[idx] = -1;
        parents[idx] = -1;
        colors[idx] = RED;
        return idx;
    }

    private static void rotateLeft(int x) {
        int y = rights[x];
        rights[x] = lefts[y];
        if (lefts[y] != -1) parents[lefts[y]] = x;
        parents[y] = parents[x];
        if (parents[x] == -1) root = y;
        else if (x == lefts[parents[x]]) lefts[parents[x]] = y;
        else rights[parents[x]] = y;
        lefts[y] = x;
        parents[x] = y;
    }

    private static void rotateRight(int x) {
        int y = lefts[x];
        lefts[x] = rights[y];
        if (rights[y] != -1) parents[rights[y]] = x;
        parents[y] = parents[x];
        if (parents[x] == -1) root = y;
        else if (x == rights[parents[x]]) rights[parents[x]] = y;
        else lefts[parents[x]] = y;
        rights[y] = x;
        parents[x] = y;
    }

    private static void fixInsert(int z) {
        while (z != root && colors[parents[z]] == RED) {
            int gp = parents[parents[z]];
            if (parents[z] == lefts[gp]) {
                int y = rights[gp];
                if (y != -1 && colors[y] == RED) {
                    colors[parents[z]] = BLACK;
                    colors[y] = BLACK;
                    colors[gp] = RED;
                    z = gp;
                } else {
                    if (z == rights[parents[z]]) {
                        z = parents[z];
                        rotateLeft(z);
                    }
                    colors[parents[z]] = BLACK;
                    colors[parents[parents[z]]] = RED;
                    rotateRight(parents[parents[z]]);
                }
            } else {
                int y = lefts[gp];
                if (y != -1 && colors[y] == RED) {
                    colors[parents[z]] = BLACK;
                    colors[y] = BLACK;
                    colors[gp] = RED;
                    z = gp;
                } else {
                    if (z == lefts[parents[z]]) {
                        z = parents[z];
                        rotateRight(z);
                    }
                    colors[parents[z]] = BLACK;
                    colors[parents[parents[z]]] = RED;
                    rotateLeft(parents[parents[z]]);
                }
            }
        }
        colors[root] = BLACK;
    }

    private static void insert(int key) {
        int y = -1;
        int x = root;
        while (x != -1) {
            y = x;
            if (key < keys[x]) x = lefts[x];
            else if (key > keys[x]) x = rights[x];
            else return;
        }
        int node = newNode(key);
        parents[node] = y;
        if (y == -1) root = node;
        else if (key < keys[y]) lefts[y] = node;
        else rights[y] = node;
        fixInsert(node);
    }

    private static void inorder(int node, List<Integer> result) {
        if (node == -1) return;
        inorder(lefts[node], result);
        result.add(keys[node]);
        inorder(rights[node], result);
    }

    public static int[] rbInsertInorder(int[] arr) {
        init(arr.length + 1);
        for (int val : arr) insert(val);
        List<Integer> result = new ArrayList<>();
        inorder(root, result);
        return result.stream().mapToInt(Integer::intValue).toArray();
    }
}
