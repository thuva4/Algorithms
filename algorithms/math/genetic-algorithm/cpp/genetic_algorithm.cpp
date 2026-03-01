#include <vector>
#include <random>
#include <algorithm>

int genetic_algorithm(const std::vector<int>& arr, int seed) {
    if (arr.empty()) return 0;
    if (arr.size() == 1) return arr[0];

    int n = static_cast<int>(arr.size());
    std::mt19937 rng(seed);
    int popSize = std::min(20, n);
    int generations = 100;
    double mutationRate = 0.1;

    std::vector<int> population(popSize);
    std::uniform_int_distribution<int> distN(0, n - 1);
    for (int i = 0; i < popSize; i++) {
        population[i] = distN(rng);
    }

    int bestIdx = population[0];
    for (int idx : population) {
        if (arr[idx] < arr[bestIdx]) bestIdx = idx;
    }

    std::uniform_int_distribution<int> distPop(0, popSize - 1);
    std::uniform_real_distribution<double> distReal(0.0, 1.0);

    for (int g = 0; g < generations; g++) {
        std::vector<int> newPop(popSize);
        for (int i = 0; i < popSize; i++) {
            int a = population[distPop(rng)];
            int b = population[distPop(rng)];
            newPop[i] = arr[a] <= arr[b] ? a : b;
        }

        std::vector<int> offspring(popSize);
        for (int i = 0; i < popSize - 1; i += 2) {
            if (distReal(rng) < 0.7) {
                offspring[i] = newPop[i];
                offspring[i + 1] = newPop[i + 1];
            } else {
                offspring[i] = newPop[i + 1];
                offspring[i + 1] = newPop[i];
            }
        }
        if (popSize % 2 != 0) {
            offspring[popSize - 1] = newPop[popSize - 1];
        }

        for (int i = 0; i < popSize; i++) {
            if (distReal(rng) < mutationRate) {
                offspring[i] = distN(rng);
            }
        }

        population = offspring;

        for (int idx : population) {
            if (arr[idx] < arr[bestIdx]) bestIdx = idx;
        }
    }

    return arr[bestIdx];
}
