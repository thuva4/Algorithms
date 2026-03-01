    #include<iostream>

    #include<conio.h>

     

    using namespace std;

     

    int min(int a, int b);

    int cost[10][10], a[10][10], i, j, k, c;

     

    int min(int a, int b)

    {

        if (a < b)

            return a;

        else

            return b;

    }

     

    int main(int argc, char **argv)

    {

        int n, m;

        cout << "Enter no of vertices";

        cin >> n;

        cout << "Enter no of edges";

        cin >> m;

        cout << "Enter the\nEDGE Cost\n";

        for (k = 1; k <= m; k++)

        {

            cin >> i >> j >> c;

            a[i][j] = cost[i][j] = c;

        }

        for (i = 1; i <= n; i++)

            for (j = 1; j <= n; j++)

            {

                if (a[i][j] == 0 && i != j)

                    a[i][j] = 31999;

            }

        for (k = 1; k <= n; k++)

            for (i = 1; i <= n; i++)

                for (j = 1; j <= n; j++)

                    a[i][j] = min(a[i][j], a[i][k] + a[k][j]);

        cout << "Resultant adj matrix\n";

        for (i = 1; i <= n; i++)

        {

            for (j = 1; j <= n; j++)

            {

                if (a[i][j] != 31999)

                    cout << a[i][j] << " ";

            }

            cout << "\n";

        }

        return 0;

    }
#include <algorithm>
#include <string>
#include <vector>

std::vector<std::vector<std::string>> johnson(int num_vertices, const std::vector<std::vector<int>>& edges_list) {
    const long long inf = 1LL << 60;
    std::vector<std::vector<long long>> dist(num_vertices, std::vector<long long>(num_vertices, inf));
    for (int node = 0; node < num_vertices; ++node) {
        dist[node][node] = 0;
    }
    for (const std::vector<int>& edge : edges_list) {
        if (edge.size() != 3) {
            continue;
        }
        dist[edge[0]][edge[1]] = std::min(dist[edge[0]][edge[1]], static_cast<long long>(edge[2]));
    }

    for (int k = 0; k < num_vertices; ++k) {
        for (int i = 0; i < num_vertices; ++i) {
            if (dist[i][k] == inf) {
                continue;
            }
            for (int j = 0; j < num_vertices; ++j) {
                if (dist[k][j] == inf) {
                    continue;
                }
                long long through_k = dist[i][k] + dist[k][j];
                if (through_k < dist[i][j]) {
                    dist[i][j] = through_k;
                }
            }
        }
    }

    for (int node = 0; node < num_vertices; ++node) {
        if (dist[node][node] < 0) {
            return {{"negative_cycle"}};
        }
    }

    std::vector<std::vector<std::string>> result(num_vertices, std::vector<std::string>(num_vertices));
    for (int i = 0; i < num_vertices; ++i) {
        for (int j = 0; j < num_vertices; ++j) {
            result[i][j] = dist[i][j] == inf ? "Infinity" : std::to_string(dist[i][j]);
        }
    }
    return result;
}
