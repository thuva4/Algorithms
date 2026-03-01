#include "reverse_linked_list.h"
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node* next;
} Node;

static Node* build_list(int arr[], int n) {
    if (n == 0) {
        return NULL;
    }
    Node* head = (Node*)malloc(sizeof(Node));
    head->value = arr[0];
    head->next = NULL;
    Node* current = head;
    for (int i = 1; i < n; i++) {
        current->next = (Node*)malloc(sizeof(Node));
        current = current->next;
        current->value = arr[i];
        current->next = NULL;
    }
    return head;
}

static void free_list(Node* head) {
    while (head != NULL) {
        Node* next = head->next;
        free(head);
        head = next;
    }
}

void reverse_linked_list(int arr[], int n, int result[], int* result_size) {
    Node* head = build_list(arr, n);

    Node* prev = NULL;
    Node* current = head;
    while (current != NULL) {
        Node* next = current->next;
        current->next = prev;
        prev = current;
        current = next;
    }

    *result_size = 0;
    Node* cur = prev;
    while (cur != NULL) {
        result[*result_size] = cur->value;
        (*result_size)++;
        cur = cur->next;
    }

    free_list(prev);
}
