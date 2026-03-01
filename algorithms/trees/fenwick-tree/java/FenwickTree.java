public class FenwickTree {
    private int[] tree;
    private int n;

    public FenwickTree(int[] arr) {
        n = arr.length;
        tree = new int[n + 1];
        for (int i = 0; i < n; i++) {
            update(i, arr[i]);
        }
    }

    public void update(int i, int delta) {
        for (++i; i <= n; i += i & (-i))
            tree[i] += delta;
    }

    public int query(int i) {
        int sum = 0;
        for (++i; i > 0; i -= i & (-i))
            sum += tree[i];
        return sum;
    }

    public static int[] fenwickTreeOperations(int[] array, java.util.List<java.util.Map<Object, Object>> queries) {
        FenwickTree fenwick = new FenwickTree(array);
        int[] current = array.clone();
        java.util.List<Integer> answers = new java.util.ArrayList<>();
        for (java.util.Map<Object, Object> query : queries) {
            String type = String.valueOf(query.get("type"));
            int index = ((Number) query.get("index")).intValue();
            if ("update".equals(type)) {
                int newValue = ((Number) query.get("value")).intValue();
                int delta = newValue - current[index];
                current[index] = newValue;
                fenwick.update(index, delta);
            } else if ("sum".equals(type)) {
                answers.add(fenwick.query(index));
            }
        }
        int[] result = new int[answers.size()];
        for (int i = 0; i < answers.size(); i++) {
            result[i] = answers.get(i);
        }
        return result;
    }

    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        FenwickTree ft = new FenwickTree(arr);
        System.out.println("Sum of first 4 elements: " + ft.query(3));

        ft.update(2, 5);
        System.out.println("After update, sum of first 4 elements: " + ft.query(3));
    }
}
