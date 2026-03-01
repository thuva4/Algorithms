import java.util.*;

public class VanEmdeBoasTree {
    private int u, minVal, maxVal, sqrtU;
    private VanEmdeBoasTree[] cluster;
    private VanEmdeBoasTree summary;

    public VanEmdeBoasTree(int u) {
        this.u = u;
        this.minVal = -1;
        this.maxVal = -1;
        if (u > 2) {
            sqrtU = (int) Math.ceil(Math.sqrt(u));
            cluster = new VanEmdeBoasTree[sqrtU];
            for (int i = 0; i < sqrtU; i++) cluster[i] = new VanEmdeBoasTree(sqrtU);
            summary = new VanEmdeBoasTree(sqrtU);
        }
    }

    private int high(int x) { return x / sqrtU; }
    private int low(int x) { return x % sqrtU; }
    private int index(int h, int l) { return h * sqrtU + l; }

    public void insert(int x) {
        if (minVal == -1) { minVal = maxVal = x; return; }
        if (x < minVal) { int t = x; x = minVal; minVal = t; }
        if (u > 2) {
            int h = high(x), l = low(x);
            if (cluster[h].minVal == -1) summary.insert(h);
            cluster[h].insert(l);
        }
        if (x > maxVal) maxVal = x;
    }

    public boolean member(int x) {
        if (x == minVal || x == maxVal) return true;
        if (u <= 2) return false;
        return cluster[high(x)].member(low(x));
    }

    public int successor(int x) {
        if (u <= 2) {
            if (x == 0 && maxVal == 1) return 1;
            return -1;
        }
        if (minVal != -1 && x < minVal) return minVal;
        int h = high(x), l = low(x);
        int maxInCluster = cluster[h].maxVal;
        if (cluster[h].minVal != -1 && l < maxInCluster) {
            int offset = cluster[h].successor(l);
            return index(h, offset);
        }
        int succCluster = summary.successor(h);
        if (succCluster == -1) return -1;
        return index(succCluster, cluster[succCluster].minVal);
    }

    public static int[] vanEmdeBoasTree(int[] data) {
        int u = data[0], nOps = data[1];
        VanEmdeBoasTree veb = new VanEmdeBoasTree(u);
        List<Integer> results = new ArrayList<>();
        int idx = 2;
        for (int i = 0; i < nOps; i++) {
            int op = data[idx], val = data[idx + 1];
            idx += 2;
            if (op == 1) veb.insert(val);
            else if (op == 2) results.add(veb.member(val) ? 1 : 0);
            else results.add(veb.successor(val));
        }
        return results.stream().mapToInt(Integer::intValue).toArray();
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(vanEmdeBoasTree(new int[]{16, 4, 1, 3, 1, 5, 2, 3, 2, 7})));
        System.out.println(Arrays.toString(vanEmdeBoasTree(new int[]{16, 6, 1, 1, 1, 4, 1, 9, 2, 4, 3, 4, 3, 9})));
    }
}
