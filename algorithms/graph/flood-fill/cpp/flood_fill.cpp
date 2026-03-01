// A C++ program to implement flood fill algorithm
#include<iostream>
using namespace std;

// Dimentions of paint screen
#define M 8
#define N 8
void floodFillUtil(int screen[][N], int x, int y, int prevC, int newC)
{
    // Base cases
    if (x < 0 || x >= M || y < 0 || y >= N)
        return;
    if (screen[x][y] != prevC)
        return;

    // Replace the color at (x, y)
    screen[x][y] = newC;

    // Recur for north, east, south and west
    floodFillUtil(screen, x+1, y, prevC, newC);
    floodFillUtil(screen, x-1, y, prevC, newC);
    floodFillUtil(screen, x, y+1, prevC, newC);
    floodFillUtil(screen, x, y-1, prevC, newC);
}

// It mainly finds the previous color on (x, y) and
// calls floodFillUtil()
void floodFill(int screen[][N], int x, int y, int newC)
{
    int prevC = screen[x][y];
    floodFillUtil(screen, x, y, prevC, newC);
}

// Driver program to test above function
int main()
{
    int screen[M][N] = {{1, 1, 1, 1, 1, 1, 1, 1},
                      {1, 1, 1, 1, 1, 1, 0, 0},
                      {1, 0, 0, 1, 1, 0, 1, 1},
                      {1, 2, 2, 2, 2, 0, 1, 0},
                      {1, 1, 1, 2, 2, 0, 1, 0},
                      {1, 1, 1, 2, 2, 2, 2, 0},
                      {1, 1, 1, 1, 1, 2, 1, 1},
                      {1, 1, 1, 1, 1, 2, 2, 1},
                     };
    int x = 4, y = 4, newC = 3;
    floodFill(screen, x, y, newC);

    cout << "Updated screen after call to floodFill: \n";
    for (int i=0; i<M; i++)
    {
        for (int j=0; j<N; j++)
           cout << screen[i][j] << " ";
        cout << endl;
    }
}
#include <queue>
#include <utility>
#include <vector>

std::vector<std::vector<int>> flood_fill(
    std::vector<std::vector<int>> grid,
    int start_row,
    int start_col,
    int new_value
) {
    if (grid.empty() || grid[0].empty()) {
        return grid;
    }
    if (start_row < 0 || start_col < 0 || start_row >= static_cast<int>(grid.size()) ||
        start_col >= static_cast<int>(grid[0].size())) {
        return grid;
    }

    int original = grid[start_row][start_col];
    if (original == new_value) {
        return grid;
    }

    static const int directions[4][2] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    std::queue<std::pair<int, int>> queue;
    queue.push({start_row, start_col});
    grid[start_row][start_col] = new_value;

    while (!queue.empty()) {
        auto [row, col] = queue.front();
        queue.pop();
        for (const auto& direction : directions) {
            int next_row = row + direction[0];
            int next_col = col + direction[1];
            if (next_row < 0 || next_col < 0 || next_row >= static_cast<int>(grid.size()) ||
                next_col >= static_cast<int>(grid[0].size())) {
                continue;
            }
            if (grid[next_row][next_col] != original) {
                continue;
            }
            grid[next_row][next_col] = new_value;
            queue.push({next_row, next_col});
        }
    }

    return grid;
}
