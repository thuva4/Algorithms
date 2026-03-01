#include <stdio.h>
#include <stdlib.h>

/* Level order traversal from array representation of a binary tree.
   null values are represented by -1 in the input array. */

void levelOrderTraversal(int arr[], int n) {
    if (n == 0) return;

    int *queue = (int *)malloc(n * sizeof(int));
    int front = 0, back = 0;
    queue[back++] = 0;

    while (front < back) {
        int idx = queue[front++];
        if (idx < n && arr[idx] != -1) {
            printf("%d ", arr[idx]);
            int left = 2 * idx + 1;
            int right = 2 * idx + 2;
            if (left < n && arr[left] != -1) queue[back++] = left;
            if (right < n && arr[right] != -1) queue[back++] = right;
        }
    }
    printf("\n");
    free(queue);
}

int main() {
    int arr[] = {1, 2, 3, 4, 5, 6, 7};
    int n = sizeof(arr) / sizeof(arr[0]);
    printf("Level order: ");
    levelOrderTraversal(arr, n);
    return 0;
}
