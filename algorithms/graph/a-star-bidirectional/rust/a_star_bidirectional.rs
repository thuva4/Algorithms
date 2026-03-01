use std::cmp::Ordering;
use std::collections::BinaryHeap;
use std::i32;

#[derive(Copy, Clone, Eq, PartialEq)]
struct Node {
    r: usize,
    c: usize,
    f: i32,
    g: i32,
}

impl Ord for Node {
    fn cmp(&self, other: &Self) -> Ordering {
        other.f.cmp(&self.f) // Min-heap
    }
}

impl PartialOrd for Node {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

pub fn a_star_bidirectional(arr: &[i32]) -> i32 {
    if arr.len() < 7 {
        return -1;
    }

    let rows = arr[0] as usize;
    let cols = arr[1] as usize;
    let sr = arr[2] as usize;
    let sc = arr[3] as usize;
    let er = arr[4] as usize;
    let ec = arr[5] as usize;
    let num_obs = arr[6] as usize;

    if arr.len() < 7 + 2 * num_obs {
        return -1;
    }

    if sr >= rows || sc >= cols || er >= rows || ec >= cols {
        return -1;
    }
    if sr == er && sc == ec {
        return 0;
    }

    let mut grid = vec![vec![false; cols]; rows];
    for i in 0..num_obs {
        let r = arr[7 + 2 * i] as usize;
        let c = arr[7 + 2 * i + 1] as usize;
        if r < rows && c < cols {
            grid[r][c] = true;
        }
    }

    if grid[sr][sc] || grid[er][ec] {
        return -1;
    }

    let mut open_f = BinaryHeap::new();
    let mut open_b = BinaryHeap::new();

    let mut g_f = vec![vec![i32::MAX; cols]; rows];
    let mut g_b = vec![vec![i32::MAX; cols]; rows];

    let h_start = (sr as i32 - er as i32).abs() + (sc as i32 - ec as i32).abs();
    g_f[sr][sc] = 0;
    open_f.push(Node {
        r: sr,
        c: sc,
        f: h_start,
        g: 0,
    });

    let h_end = (er as i32 - sr as i32).abs() + (ec as i32 - sc as i32).abs();
    g_b[er][ec] = 0;
    open_b.push(Node {
        r: er,
        c: ec,
        f: h_end,
        g: 0,
    });

    let mut best_path = i32::MAX;
    let dr = [-1, 1, 0, 0];
    let dc = [0, 0, -1, 1];

    while !open_f.is_empty() && !open_b.is_empty() {
        if let Some(u) = open_f.pop() {
            if u.g <= g_f[u.r][u.c] {
                for i in 0..4 {
                    let nr = u.r as i32 + dr[i];
                    let nc = u.c as i32 + dc[i];

                    if nr >= 0 && nr < rows as i32 && nc >= 0 && nc < cols as i32 {
                        let nr = nr as usize;
                        let nc = nc as usize;
                        if !grid[nr][nc] {
                            let new_g = u.g + 1;
                            if new_g < g_f[nr][nc] {
                                g_f[nr][nc] = new_g;
                                let h = (nr as i32 - er as i32).abs() + (nc as i32 - ec as i32).abs();
                                open_f.push(Node {
                                    r: nr,
                                    c: nc,
                                    f: new_g + h,
                                    g: new_g,
                                });

                                if g_b[nr][nc] != i32::MAX {
                                    best_path = std::cmp::min(best_path, new_g + g_b[nr][nc]);
                                }
                            }
                        }
                    }
                }
            }
        }

        if let Some(u) = open_b.pop() {
            if u.g <= g_b[u.r][u.c] {
                for i in 0..4 {
                    let nr = u.r as i32 + dr[i];
                    let nc = u.c as i32 + dc[i];

                    if nr >= 0 && nr < rows as i32 && nc >= 0 && nc < cols as i32 {
                        let nr = nr as usize;
                        let nc = nc as usize;
                        if !grid[nr][nc] {
                            let new_g = u.g + 1;
                            if new_g < g_b[nr][nc] {
                                g_b[nr][nc] = new_g;
                                let h = (nr as i32 - sr as i32).abs() + (nc as i32 - sc as i32).abs();
                                open_b.push(Node {
                                    r: nr,
                                    c: nc,
                                    f: new_g + h,
                                    g: new_g,
                                });

                                if g_f[nr][nc] != i32::MAX {
                                    best_path = std::cmp::min(best_path, new_g + g_f[nr][nc]);
                                }
                            }
                        }
                    }
                }
            }
        }

        let min_f = open_f.peek().map(|n| n.f).unwrap_or(i32::MAX);
        let min_b = open_b.peek().map(|n| n.f).unwrap_or(i32::MAX);

        if best_path != i32::MAX && (min_f as i64 + min_b as i64) >= best_path as i64 {
            break;
        }
    }

    if best_path == i32::MAX {
        -1
    } else {
        best_path
    }
}
