import java.util.*;

public class FibonacciHeap {
    static class Node {
        int key, degree;
        Node parent, child, left, right;
        boolean mark;

        Node(int key) {
            this.key = key;
            this.left = this;
            this.right = this;
        }
    }

    private Node minNode;
    private int n;

    public FibonacciHeap() {
        minNode = null;
        n = 0;
    }

    public void insert(int key) {
        Node node = new Node(key);
        if (minNode == null) {
            minNode = node;
        } else {
            addToRootList(node);
            if (node.key < minNode.key) minNode = node;
        }
        n++;
    }

    public int extractMin() {
        Node z = minNode;
        if (z == null) return -1;
        if (z.child != null) {
            List<Node> children = getSiblings(z.child);
            for (Node c : children) {
                addToRootList(c);
                c.parent = null;
            }
        }
        removeFromList(z);
        if (z == z.right) {
            minNode = null;
        } else {
            minNode = z.right;
            consolidate();
        }
        n--;
        return z.key;
    }

    private void addToRootList(Node node) {
        node.left = minNode;
        node.right = minNode.right;
        minNode.right.left = node;
        minNode.right = node;
    }

    private void removeFromList(Node node) {
        node.left.right = node.right;
        node.right.left = node.left;
    }

    private List<Node> getSiblings(Node node) {
        List<Node> list = new ArrayList<>();
        Node curr = node;
        do {
            list.add(curr);
            curr = curr.right;
        } while (curr != node);
        return list;
    }

    private void consolidate() {
        int maxDegree = (int) (Math.log(n) / Math.log(2)) + 2;
        Node[] A = new Node[maxDegree + 1];
        List<Node> roots = getSiblings(minNode);
        for (Node w : roots) {
            Node x = w;
            int d = x.degree;
            while (d < A.length && A[d] != null) {
                Node y = A[d];
                if (x.key > y.key) { Node t = x; x = y; y = t; }
                link(y, x);
                A[d] = null;
                d++;
            }
            if (d >= A.length) A = Arrays.copyOf(A, d + 1);
            A[d] = x;
        }
        minNode = null;
        for (Node node : A) {
            if (node != null) {
                node.left = node;
                node.right = node;
                if (minNode == null) {
                    minNode = node;
                } else {
                    addToRootList(node);
                    if (node.key < minNode.key) minNode = node;
                }
            }
        }
    }

    private void link(Node y, Node x) {
        removeFromList(y);
        y.left = y;
        y.right = y;
        if (x.child == null) {
            x.child = y;
        } else {
            y.left = x.child;
            y.right = x.child.right;
            x.child.right.left = y;
            x.child.right = y;
        }
        y.parent = x;
        x.degree++;
        y.mark = false;
    }

    public static int[] fibonacciHeap(int[] operations) {
        FibonacciHeap heap = new FibonacciHeap();
        List<Integer> results = new ArrayList<>();
        for (int op : operations) {
            if (op == 0) {
                results.add(heap.extractMin());
            } else {
                heap.insert(op);
            }
        }
        return results.stream().mapToInt(Integer::intValue).toArray();
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(fibonacciHeap(new int[]{3, 1, 4, 0, 0})));
        System.out.println(Arrays.toString(fibonacciHeap(new int[]{5, 2, 8, 1, 0, 0, 0, 0})));
    }
}
