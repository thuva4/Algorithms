#include "genetic_algorithm.h"
#include <stdlib.h>

static unsigned int ga_state;

static unsigned int ga_next(void) {
    ga_state = ga_state * 1103515245u + 12345u;
    return (ga_state >> 16) & 0x7FFF;
}

static double ga_double(void) {
    return (double)ga_next() / 32767.0;
}

int genetic_algorithm(const int arr[], int n, int seed) {
    if (n == 0) return 0;
    if (n == 1) return arr[0];

    ga_state = (unsigned int)seed;
    int pop_size = n < 20 ? n : 20;
    int generations = 100;
    double mutation_rate = 0.1;

    int *population = (int *)malloc(pop_size * sizeof(int));
    int *new_pop = (int *)malloc(pop_size * sizeof(int));
    int *offspring = (int *)malloc(pop_size * sizeof(int));

    int i, g;
    for (i = 0; i < pop_size; i++) {
        population[i] = (int)(ga_next() % n);
    }

    int best_idx = population[0];
    for (i = 1; i < pop_size; i++) {
        if (arr[population[i]] < arr[best_idx]) best_idx = population[i];
    }

    for (g = 0; g < generations; g++) {
        for (i = 0; i < pop_size; i++) {
            int a = population[ga_next() % pop_size];
            int b = population[ga_next() % pop_size];
            new_pop[i] = arr[a] <= arr[b] ? a : b;
        }

        for (i = 0; i < pop_size - 1; i += 2) {
            if (ga_double() < 0.7) {
                offspring[i] = new_pop[i];
                offspring[i + 1] = new_pop[i + 1];
            } else {
                offspring[i] = new_pop[i + 1];
                offspring[i + 1] = new_pop[i];
            }
        }
        if (pop_size % 2 != 0) {
            offspring[pop_size - 1] = new_pop[pop_size - 1];
        }

        for (i = 0; i < pop_size; i++) {
            if (ga_double() < mutation_rate) {
                offspring[i] = (int)(ga_next() % n);
            }
        }

        for (i = 0; i < pop_size; i++) {
            population[i] = offspring[i];
        }

        for (i = 0; i < pop_size; i++) {
            if (arr[population[i]] < arr[best_idx]) best_idx = population[i];
        }
    }

    free(population);
    free(new_pop);
    free(offspring);

    return arr[best_idx];
}
