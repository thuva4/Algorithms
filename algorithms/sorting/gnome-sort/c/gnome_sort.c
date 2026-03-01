#include "gnome_sort.h"

void gnome_sort(int arr[], int n) {
    if (n <= 1) {
        return;
    }

    int index = 1;
    while (index < n) {
        if (index == 0) {
            index++;
        } else if (arr[index] >= arr[index - 1]) {
            index++;
        } else {
            int temp = arr[index];
            arr[index] = arr[index - 1];
            arr[index - 1] = temp;
            index--;
        }
    }
}
