import java.util.Arrays;

public class HungarianAlgorithm {

    /**
     * Solve the assignment problem using the Hungarian algorithm in O(n^3).
     *
     * @param cost n x n cost matrix
     * @return array where result[i] is the job assigned to worker i
     */
    public static int[] hungarian(int[][] cost) {
        int n = cost.length;
        int[] u = new int[n + 1];
        int[] v = new int[n + 1];
        int[] matchJob = new int[n + 1]; // matchJob[j] = worker matched to job j

        for (int i = 1; i <= n; i++) {
            matchJob[0] = i;
            int j0 = 0;
            int[] dist = new int[n + 1];
            boolean[] used = new boolean[n + 1];
            int[] prevJob = new int[n + 1];
            Arrays.fill(dist, Integer.MAX_VALUE);

            while (true) {
                used[j0] = true;
                int w = matchJob[j0];
                int delta = Integer.MAX_VALUE;
                int j1 = -1;

                for (int j = 1; j <= n; j++) {
                    if (!used[j]) {
                        int cur = cost[w - 1][j - 1] - u[w] - v[j];
                        if (cur < dist[j]) {
                            dist[j] = cur;
                            prevJob[j] = j0;
                        }
                        if (dist[j] < delta) {
                            delta = dist[j];
                            j1 = j;
                        }
                    }
                }

                for (int j = 0; j <= n; j++) {
                    if (used[j]) {
                        u[matchJob[j]] += delta;
                        v[j] -= delta;
                    } else {
                        dist[j] -= delta;
                    }
                }

                j0 = j1;
                if (matchJob[j0] == 0) break;
            }

            while (j0 != 0) {
                matchJob[j0] = matchJob[prevJob[j0]];
                j0 = prevJob[j0];
            }
        }

        int[] assignment = new int[n];
        for (int j = 1; j <= n; j++) {
            assignment[matchJob[j] - 1] = j - 1;
        }
        return assignment;
    }

    public static int totalCost(int[][] cost, int[] assignment) {
        int total = 0;
        for (int i = 0; i < cost.length; i++) {
            total += cost[i][assignment[i]];
        }
        return total;
    }

    public static void main(String[] args) {
        int[][] cost = {{9, 2, 7}, {6, 4, 3}, {5, 8, 1}};
        int[] assignment = hungarian(cost);
        System.out.println("Assignment: " + Arrays.toString(assignment));
        System.out.println("Total cost: " + totalCost(cost, assignment));
    }
}
