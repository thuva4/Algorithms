import java.util.*;

public class Treap {
    private static Random rng = new Random(42);

    static class Node {
        int key, priority;
        Node left, right;
        Node(int key) {
            this.key = key;
            this.priority = rng.nextInt();
        }
    }

    private static Node rightRotate(Node p) {
        Node q = p.left;
        p.left = q.right;
        q.right = p;
        return q;
    }

    private static Node leftRotate(Node p) {
        Node q = p.right;
        p.right = q.left;
        q.left = p;
        return q;
    }

    private static Node insert(Node root, int key) {
        if (root == null) return new Node(key);
        if (key < root.key) {
            root.left = insert(root.left, key);
            if (root.left.priority > root.priority) root = rightRotate(root);
        } else if (key > root.key) {
            root.right = insert(root.right, key);
            if (root.right.priority > root.priority) root = leftRotate(root);
        }
        return root;
    }

    private static void inorder(Node node, List<Integer> result) {
        if (node == null) return;
        inorder(node.left, result);
        result.add(node.key);
        inorder(node.right, result);
    }

    public static int[] treap(int[] arr) {
        Node root = null;
        for (int val : arr) root = insert(root, val);
        List<Integer> result = new ArrayList<>();
        inorder(root, result);
        return result.stream().mapToInt(Integer::intValue).toArray();
    }
}
