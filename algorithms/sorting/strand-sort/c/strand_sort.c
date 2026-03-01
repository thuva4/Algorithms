#include "strand_sort.h"
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node* next;
} Node;

static void push(Node** head_ref, int new_data) {
    Node* new_node = (Node*)malloc(sizeof(Node));
    new_node->data = new_data;
    new_node->next = (*head_ref);
    (*head_ref) = new_node;
}

static void merge(Node** sorted, Node* strand) {
    if (*sorted == NULL) {
        *sorted = strand;
        return;
    }

    Node* head = NULL;
    Node** tail = &head;
    Node* a = *sorted;
    Node* b = strand;

    while (a && b) {
        if (a->data <= b->data) {
            *tail = a;
            a = a->next;
        } else {
            *tail = b;
            b = b->next;
        }
        tail = &((*tail)->next);
    }

    if (a) *tail = a;
    if (b) *tail = b;

    *sorted = head;
}

void strand_sort(int arr[], int n) {
    if (n <= 0) return;

    Node* head = NULL;
    for (int i = n - 1; i >= 0; i--) {
        push(&head, arr[i]);
    }

    Node* sorted = NULL;

    while (head != NULL) {
        Node* strand = head;
        Node** tail_strand = &strand->next;
        head = head->next;
        *tail_strand = NULL;

        Node* curr = head;
        Node** prev = &head;

        while (curr != NULL) {
            if (curr->data >= strand->data) {
                // Determine if curr should be appended to strand
                // We need to compare with the last element of strand
                Node* last = strand;
                while (last->next != NULL) last = last->next;
                
                if (curr->data >= last->data) {
                    // Move curr from list to strand
                    *prev = curr->next;
                    curr->next = NULL;
                    last->next = curr;
                    curr = *prev;
                    continue;
                }
            }
            prev = &curr->next;
            curr = curr->next;
        }
        merge(&sorted, strand);
    }

    int i = 0;
    while (sorted != NULL) {
        arr[i++] = sorted->data;
        Node* temp = sorted;
        sorted = sorted->next;
        free(temp);
    }
}
