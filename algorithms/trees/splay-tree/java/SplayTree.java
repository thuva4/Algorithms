import java.util.ArrayList;
import java.util.List;

public class SplayTree {
    static class Node {
        int key;
        Node left, right;
        Node(int key) { this.key = key; }
    }

    private static Node rightRotate(Node x) {
        Node y = x.left;
        x.left = y.right;
        y.right = x;
        return y;
    }

    private static Node leftRotate(Node x) {
        Node y = x.right;
        x.right = y.left;
        y.left = x;
        return y;
    }

    private static Node splay(Node root, int key) {
        if (root == null || root.key == key) return root;
        if (key < root.key) {
            if (root.left == null) return root;
            if (key < root.left.key) {
                root.left.left = splay(root.left.left, key);
                root = rightRotate(root);
            } else if (key > root.left.key) {
                root.left.right = splay(root.left.right, key);
                if (root.left.right != null) root.left = leftRotate(root.left);
            }
            return root.left == null ? root : rightRotate(root);
        } else {
            if (root.right == null) return root;
            if (key > root.right.key) {
                root.right.right = splay(root.right.right, key);
                root = leftRotate(root);
            } else if (key < root.right.key) {
                root.right.left = splay(root.right.left, key);
                if (root.right.left != null) root.right = rightRotate(root.right);
            }
            return root.right == null ? root : leftRotate(root);
        }
    }

    private static Node insert(Node root, int key) {
        if (root == null) return new Node(key);
        root = splay(root, key);
        if (root.key == key) return root;
        Node node = new Node(key);
        if (key < root.key) {
            node.right = root;
            node.left = root.left;
            root.left = null;
        } else {
            node.left = root;
            node.right = root.right;
            root.right = null;
        }
        return node;
    }

    private static void inorder(Node node, List<Integer> result) {
        if (node == null) return;
        inorder(node.left, result);
        result.add(node.key);
        inorder(node.right, result);
    }

    public static int[] splayTree(int[] arr) {
        Node root = null;
        for (int val : arr) root = insert(root, val);
        List<Integer> result = new ArrayList<>();
        inorder(root, result);
        return result.stream().mapToInt(Integer::intValue).toArray();
    }
}
