package algorithms.sorting.treesort;

public class TreeSort {
    static class Node {
        int key;
        Node left, right;

        public Node(int item) {
            key = item;
            left = right = null;
        }
    }

    public static void sort(int[] arr) {
        Node root = null;
        for (int value : arr) {
            root = insert(root, value);
        }

        int[] index = {0};
        storeSorted(root, arr, index);
    }

    private static Node insert(Node root, int key) {
        if (root == null) {
            root = new Node(key);
            return root;
        }

        if (key < root.key)
            root.left = insert(root.left, key);
        else
            root.right = insert(root.right, key);

        return root;
    }

    private static void storeSorted(Node root, int[] arr, int[] index) {
        if (root != null) {
            storeSorted(root.left, arr, index);
            arr[index[0]++] = root.key;
            storeSorted(root.right, arr, index);
        }
    }
}
