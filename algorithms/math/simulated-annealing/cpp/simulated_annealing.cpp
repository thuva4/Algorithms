#include <vector>
#include <cmath>
#include <random>

int simulated_annealing(const std::vector<int>& arr) {
    if (arr.empty()) return 0;
    if (arr.size() == 1) return arr[0];

    int n = static_cast<int>(arr.size());
    std::mt19937 rng(42);

    int current = 0;
    int best = 0;
    double temperature = 1000.0;
    double coolingRate = 0.995;
    double minTemp = 0.01;

    while (temperature > minTemp) {
        std::uniform_int_distribution<int> dist(0, n - 1);
        int neighbor = dist(rng);
        int delta = arr[neighbor] - arr[current];

        if (delta < 0) {
            current = neighbor;
        } else {
            double probability = std::exp(-delta / temperature);
            std::uniform_real_distribution<double> realDist(0.0, 1.0);
            if (realDist(rng) < probability) {
                current = neighbor;
            }
        }

        if (arr[current] < arr[best]) {
            best = current;
        }

        temperature *= coolingRate;
    }

    return arr[best];
}
