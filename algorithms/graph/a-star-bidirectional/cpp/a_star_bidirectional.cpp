#include "a_star_bidirectional.h"
#include <vector>
#include <queue>
#include <cmath>
#include <climits>
#include <map>

struct Node {
    int r, c;
    int f, g;
    
    bool operator>(const Node& other) const {
        return f > other.f;
    }
};

static int heuristic(int r1, int c1, int r2, int c2) {
    return std::abs(r1 - r2) + std::abs(c1 - c2);
}

int a_star_bidirectional(const std::vector<int>& arr) {
    if (arr.size() < 7) return -1;
    
    int rows = arr[0];
    int cols = arr[1];
    int sr = arr[2], sc = arr[3];
    int er = arr[4], ec = arr[5];
    int num_obs = arr[6];
    
    if (arr.size() < 7 + 2 * num_obs) return -1;
    
    if (sr < 0 || sr >= rows || sc < 0 || sc >= cols || er < 0 || er >= rows || ec < 0 || ec >= cols) return -1;
    if (sr == er && sc == ec) return 0;
    
    std::vector<int> grid(rows * cols, 0);
    for (int i = 0; i < num_obs; i++) {
        int r = arr[7 + 2 * i];
        int c = arr[7 + 2 * i + 1];
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
            grid[r * cols + c] = 1;
        }
    }
    
    if (grid[sr * cols + sc] || grid[er * cols + ec]) return -1;
    
    std::priority_queue<Node, std::vector<Node>, std::greater<Node>> openF, openB;
    std::vector<int> gF(rows * cols, INT_MAX);
    std::vector<int> gB(rows * cols, INT_MAX);
    
    gF[sr * cols + sc] = 0;
    openF.push({sr, sc, heuristic(sr, sc, er, ec), 0});
    
    gB[er * cols + ec] = 0;
    openB.push({er, ec, heuristic(er, ec, sr, sc), 0});
    
    int bestPath = INT_MAX;
    int dr[] = {-1, 1, 0, 0};
    int dc[] = {0, 0, -1, 1};
    
    while (!openF.empty() && !openB.empty()) {
        if (!openF.empty()) {
            Node u = openF.top();
            openF.pop();
            
            if (u.g > gF[u.r * cols + u.c]) goto skipF;
            
            for (int i = 0; i < 4; i++) {
                int nr = u.r + dr[i];
                int nc = u.c + dc[i];
                
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr * cols + nc] == 0) {
                    int newG = u.g + 1;
                    if (newG < gF[nr * cols + nc]) {
                        gF[nr * cols + nc] = newG;
                        int h = heuristic(nr, nc, er, ec);
                        openF.push({nr, nc, newG + h, newG});
                        
                        if (gB[nr * cols + nc] != INT_MAX) {
                            bestPath = std::min(bestPath, newG + gB[nr * cols + nc]);
                        }
                    }
                }
            }
        }
        skipF:;
        
        if (!openB.empty()) {
            Node u = openB.top();
            openB.pop();
            
            if (u.g > gB[u.r * cols + u.c]) goto skipB;
            
            for (int i = 0; i < 4; i++) {
                int nr = u.r + dr[i];
                int nc = u.c + dc[i];
                
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr * cols + nc] == 0) {
                    int newG = u.g + 1;
                    if (newG < gB[nr * cols + nc]) {
                        gB[nr * cols + nc] = newG;
                        int h = heuristic(nr, nc, sr, sc);
                        openB.push({nr, nc, newG + h, newG});
                        
                        if (gF[nr * cols + nc] != INT_MAX) {
                            bestPath = std::min(bestPath, newG + gF[nr * cols + nc]);
                        }
                    }
                }
            }
        }
        skipB:;
        
        int minF = openF.empty() ? INT_MAX : openF.top().f;
        int minB = openB.empty() ? INT_MAX : openB.top().f;
        
        // This termination condition might be slightly loose for general graphs but OK for unit grid
        if (bestPath != INT_MAX && minF + minB >= bestPath) break;
    }
    
    return bestPath == INT_MAX ? -1 : bestPath;
}
