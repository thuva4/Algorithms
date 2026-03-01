package algorithms.graph.astarbidirectional;

import java.util.PriorityQueue;
import java.util.Arrays;

public class AStarBidirectional {
    private static class Node implements Comparable<Node> {
        int r, c;
        int f, g;

        Node(int r, int c, int f, int g) {
            this.r = r;
            this.c = c;
            this.f = f;
            this.g = g;
        }

        @Override
        public int compareTo(Node other) {
            return Integer.compare(this.f, other.f);
        }
    }

    public int solve(int[] arr) {
        if (arr == null || arr.length < 7) return -1;

        int rows = arr[0];
        int cols = arr[1];
        int sr = arr[2], sc = arr[3];
        int er = arr[4], ec = arr[5];
        int numObs = arr[6];

        if (arr.length < 7 + 2 * numObs) return -1;

        if (sr < 0 || sr >= rows || sc < 0 || sc >= cols || er < 0 || er >= rows || ec < 0 || ec >= cols) return -1;
        if (sr == er && sc == ec) return 0;

        boolean[][] grid = new boolean[rows][cols];
        for (int i = 0; i < numObs; i++) {
            int r = arr[7 + 2 * i];
            int c = arr[7 + 2 * i + 1];
            if (r >= 0 && r < rows && c >= 0 && c < cols) {
                grid[r][c] = true;
            }
        }

        if (grid[sr][sc] || grid[er][ec]) return -1;

        PriorityQueue<Node> openF = new PriorityQueue<>();
        PriorityQueue<Node> openB = new PriorityQueue<>();

        int[][] gF = new int[rows][cols];
        int[][] gB = new int[rows][cols];

        for (int r = 0; r < rows; r++) {
            Arrays.fill(gF[r], Integer.MAX_VALUE);
            Arrays.fill(gB[r], Integer.MAX_VALUE);
        }

        int hStart = Math.abs(sr - er) + Math.abs(sc - ec);
        gF[sr][sc] = 0;
        openF.add(new Node(sr, sc, hStart, 0));

        int hEnd = Math.abs(er - sr) + Math.abs(ec - sc);
        gB[er][ec] = 0;
        openB.add(new Node(er, ec, hEnd, 0));

        int bestPath = Integer.MAX_VALUE;
        int[] dr = {-1, 1, 0, 0};
        int[] dc = {0, 0, -1, 1};

        while (!openF.isEmpty() && !openB.isEmpty()) {
            if (!openF.isEmpty()) {
                Node u = openF.poll();
                if (u.g <= gF[u.r][u.c]) {
                    for (int i = 0; i < 4; i++) {
                        int nr = u.r + dr[i];
                        int nc = u.c + dc[i];

                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !grid[nr][nc]) {
                            int newG = u.g + 1;
                            if (newG < gF[nr][nc]) {
                                gF[nr][nc] = newG;
                                int h = Math.abs(nr - er) + Math.abs(nc - ec);
                                openF.add(new Node(nr, nc, newG + h, newG));

                                if (gB[nr][nc] != Integer.MAX_VALUE) {
                                    bestPath = Math.min(bestPath, newG + gB[nr][nc]);
                                }
                            }
                        }
                    }
                }
            }

            if (!openB.isEmpty()) {
                Node u = openB.poll();
                if (u.g <= gB[u.r][u.c]) {
                    for (int i = 0; i < 4; i++) {
                        int nr = u.r + dr[i];
                        int nc = u.c + dc[i];

                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !grid[nr][nc]) {
                            int newG = u.g + 1;
                            if (newG < gB[nr][nc]) {
                                gB[nr][nc] = newG;
                                int h = Math.abs(nr - sr) + Math.abs(nc - sc);
                                openB.add(new Node(nr, nc, newG + h, newG));

                                if (gF[nr][nc] != Integer.MAX_VALUE) {
                                    bestPath = Math.min(bestPath, newG + gF[nr][nc]);
                                }
                            }
                        }
                    }
                }
            }

            int minF = openF.isEmpty() ? Integer.MAX_VALUE : openF.peek().f;
            int minB = openB.isEmpty() ? Integer.MAX_VALUE : openB.peek().f;

            if (bestPath != Integer.MAX_VALUE && (long) minF + minB >= bestPath) break;
        }

        return bestPath == Integer.MAX_VALUE ? -1 : bestPath;
    }
}
