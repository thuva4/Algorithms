import java.util.ArrayList;
import java.util.List;

public class BinarySearchTree {

    private static class Node {
        int key;
        Node left, right;

        Node(int key) {
            this.key = key;
        }
    }

    private static Node insert(Node root, int key) {
        if (root == null) {
            return new Node(key);
        }
        if (key <= root.key) {
            root.left = insert(root.left, key);
        } else {
            root.right = insert(root.right, key);
        }
        return root;
    }

    private static void inorder(Node root, List<Integer> result) {
        if (root == null) {
            return;
        }
        inorder(root.left, result);
        result.add(root.key);
        inorder(root.right, result);
    }

    public static int[] bstInorder(int[] arr) {
        Node root = null;
        for (int key : arr) {
            root = insert(root, key);
        }

        List<Integer> result = new ArrayList<>();
        inorder(root, result);

        return result.stream().mapToInt(Integer::intValue).toArray();
    }
}
