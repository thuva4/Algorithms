#include "simulated_annealing.h"
#include <math.h>
#include <stdlib.h>

static unsigned int lcg_state = 42;

static unsigned int lcg_next(void) {
    lcg_state = lcg_state * 1103515245u + 12345u;
    return (lcg_state >> 16) & 0x7FFF;
}

static double lcg_double(void) {
    return (double)lcg_next() / 32767.0;
}

int simulated_annealing(const int arr[], int n) {
    if (n == 0) return 0;
    if (n == 1) return arr[0];

    lcg_state = 42;
    int current = 0;
    int best = 0;
    double temperature = 1000.0;
    double cooling_rate = 0.995;
    double min_temp = 0.01;

    while (temperature > min_temp) {
        int neighbor = (int)(lcg_next() % n);
        int delta = arr[neighbor] - arr[current];

        if (delta < 0) {
            current = neighbor;
        } else {
            double probability = exp(-(double)delta / temperature);
            if (lcg_double() < probability) {
                current = neighbor;
            }
        }

        if (arr[current] < arr[best]) {
            best = current;
        }

        temperature *= cooling_rate;
    }

    return arr[best];
}
