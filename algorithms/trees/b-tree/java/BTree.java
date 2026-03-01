import java.util.ArrayList;
import java.util.List;

public class BTree {
    private static final int T = 3;

    static class Node {
        int[] keys = new int[2 * T - 1];
        Node[] children = new Node[2 * T];
        int n = 0;
        boolean leaf = true;
    }

    public static int[] bTree(int[] arr) {
        if (arr.length == 0) return new int[0];

        Node root = new Node();

        for (int val : arr) {
            root = insert(root, val);
        }

        List<Integer> result = new ArrayList<>();
        inorder(root, result);
        return result.stream().mapToInt(Integer::intValue).toArray();
    }

    private static Node insert(Node root, int key) {
        if (root.n == 2 * T - 1) {
            Node newRoot = new Node();
            newRoot.leaf = false;
            newRoot.children[0] = root;
            splitChild(newRoot, 0);
            root = newRoot;
        }
        insertNonFull(root, key);
        return root;
    }

    private static void splitChild(Node parent, int i) {
        Node full = parent.children[i];
        Node newNode = new Node();
        newNode.leaf = full.leaf;
        newNode.n = T - 1;

        for (int j = 0; j < T - 1; j++) {
            newNode.keys[j] = full.keys[j + T];
        }
        if (!full.leaf) {
            for (int j = 0; j < T; j++) {
                newNode.children[j] = full.children[j + T];
            }
        }

        for (int j = parent.n; j > i; j--) {
            parent.children[j + 1] = parent.children[j];
        }
        parent.children[i + 1] = newNode;

        for (int j = parent.n - 1; j >= i; j--) {
            parent.keys[j + 1] = parent.keys[j];
        }
        parent.keys[i] = full.keys[T - 1];
        full.n = T - 1;
        parent.n++;
    }

    private static void insertNonFull(Node node, int key) {
        int i = node.n - 1;
        if (node.leaf) {
            while (i >= 0 && key < node.keys[i]) {
                node.keys[i + 1] = node.keys[i];
                i--;
            }
            node.keys[i + 1] = key;
            node.n++;
        } else {
            while (i >= 0 && key < node.keys[i]) {
                i--;
            }
            i++;
            if (node.children[i].n == 2 * T - 1) {
                splitChild(node, i);
                if (key > node.keys[i]) {
                    i++;
                }
            }
            insertNonFull(node.children[i], key);
        }
    }

    private static void inorder(Node node, List<Integer> result) {
        if (node == null) return;
        for (int i = 0; i < node.n; i++) {
            if (!node.leaf) {
                inorder(node.children[i], result);
            }
            result.add(node.keys[i]);
        }
        if (!node.leaf) {
            inorder(node.children[node.n], result);
        }
    }
}
