#include <vector>

using namespace std;

int point_in_polygon(vector<int> arr) {
    int px = arr[0], py = arr[1];
    int n = arr[2];
    vector<int> polyX(n), polyY(n);
    for (int i = 0; i < n; i++) {
        polyX[i] = arr[3 + 2 * i];
        polyY[i] = arr[3 + 2 * i + 1];
    }

    bool inside = false;
    int j = n - 1;
    for (int i = 0; i < n; i++) {
        if ((polyY[i] > py) != (polyY[j] > py) &&
            px < (double)(polyX[j] - polyX[i]) * (py - polyY[i]) / (polyY[j] - polyY[i]) + polyX[i]) {
            inside = !inside;
        }
        j = i;
    }

    return inside ? 1 : 0;
}
