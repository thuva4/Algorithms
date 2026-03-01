import heapq
import sys

def a_star_bidirectional(arr):
    if len(arr) < 7:
        return -1
        
    rows = arr[0]
    cols = arr[1]
    sr, sc = arr[2], arr[3]
    er, ec = arr[4], arr[5]
    num_obs = arr[6]
    
    if len(arr) < 7 + 2 * num_obs:
        return -1
        
    if not (0 <= sr < rows and 0 <= sc < cols and 0 <= er < rows and 0 <= ec < cols):
        return -1
    if sr == er and sc == ec:
        return 0
        
    grid = [[0] * cols for _ in range(rows)]
    idx = 7
    for _ in range(num_obs):
        r, c = arr[idx], arr[idx+1]
        idx += 2
        if 0 <= r < rows and 0 <= c < cols:
            grid[r][c] = 1
            
    if grid[sr][sc] or grid[er][ec]:
        return -1
        
    def heuristic(r1, c1, r2, c2):
        return abs(r1 - r2) + abs(c1 - c2)
        
    open_f = []
    open_b = []
    
    g_f = {}
    g_b = {}
    
    h_start = heuristic(sr, sc, er, ec)
    heapq.heappush(open_f, (h_start, sr, sc))
    g_f[(sr, sc)] = 0
    
    h_end = heuristic(er, ec, sr, sc)
    heapq.heappush(open_b, (h_end, er, ec))
    g_b[(er, ec)] = 0
    
    best_path = float('inf')
    
    while open_f and open_b:
        # Forward
        if open_f:
            f, r, c = heapq.heappop(open_f)
            if g_f[(r, c)] <= f: # Using f as proxy check, usually check g
                # Better: if g_f[(r,c)] < actual g used to calculate f? No f contains g
                pass
            
            # Simple check if current g is optimal so far
            # Actually with heaps we might pop outdated nodes
            # We can check:
            # But here we just proceed.
            
            for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0:
                    new_g = g_f[(r, c)] + 1
                    if new_g < g_f.get((nr, nc), float('inf')):
                        g_f[(nr, nc)] = new_g
                        h = heuristic(nr, nc, er, ec)
                        heapq.heappush(open_f, (new_g + h, nr, nc))
                        
                        if (nr, nc) in g_b:
                            best_path = min(best_path, new_g + g_b[(nr, nc)])

        # Backward
        if open_b:
            f, r, c = heapq.heappop(open_b)
            
            for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0:
                    new_g = g_b[(r, c)] + 1
                    if new_g < g_b.get((nr, nc), float('inf')):
                        g_b[(nr, nc)] = new_g
                        h = heuristic(nr, nc, sr, sc)
                        heapq.heappush(open_b, (new_g + h, nr, nc))
                        
                        if (nr, nc) in g_f:
                            best_path = min(best_path, new_g + g_f[(nr, nc)])
                            
        min_f = open_f[0][0] if open_f else float('inf')
        min_b = open_b[0][0] if open_b else float('inf')
        
        if best_path != float('inf') and min_f + min_b >= best_path:
            break
            
    return best_path if best_path != float('inf') else -1
