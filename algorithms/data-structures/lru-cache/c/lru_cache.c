#include "lru_cache.h"
#include <stdlib.h>

typedef struct Node {
    int key;
    int value;
    struct Node* prev;
    struct Node* next;
} Node;

typedef struct {
    int capacity;
    int size;
    Node* head;
    Node* tail;
    Node** buckets;
    int bucket_count;
} LRUCache;

static unsigned int hash_key(int key, int bucket_count) {
    unsigned int k = (unsigned int)key;
    return k % (unsigned int)bucket_count;
}

static Node* find_node(LRUCache* cache, int key) {
    unsigned int h = hash_key(key, cache->bucket_count);
    /* Linear probing through the linked list to find the key */
    Node* cur = cache->head->next;
    while (cur != cache->tail) {
        if (cur->key == key) {
            return cur;
        }
        cur = cur->next;
    }
    return NULL;
}

static void remove_node(Node* node) {
    node->prev->next = node->next;
    node->next->prev = node->prev;
}

static void add_to_head(LRUCache* cache, Node* node) {
    node->next = cache->head->next;
    node->prev = cache->head;
    cache->head->next->prev = node;
    cache->head->next = node;
}

static LRUCache* create_cache(int capacity) {
    LRUCache* cache = (LRUCache*)malloc(sizeof(LRUCache));
    cache->capacity = capacity;
    cache->size = 0;
    cache->bucket_count = capacity * 2 + 1;
    cache->buckets = (Node**)calloc(cache->bucket_count, sizeof(Node*));
    cache->head = (Node*)malloc(sizeof(Node));
    cache->tail = (Node*)malloc(sizeof(Node));
    cache->head->prev = NULL;
    cache->head->next = cache->tail;
    cache->tail->prev = cache->head;
    cache->tail->next = NULL;
    return cache;
}

static int cache_get(LRUCache* cache, int key) {
    Node* node = find_node(cache, key);
    if (node == NULL) {
        return -1;
    }
    remove_node(node);
    add_to_head(cache, node);
    return node->value;
}

static void cache_put(LRUCache* cache, int key, int value) {
    Node* node = find_node(cache, key);
    if (node != NULL) {
        node->value = value;
        remove_node(node);
        add_to_head(cache, node);
    } else {
        if (cache->size == cache->capacity) {
            Node* lru = cache->tail->prev;
            remove_node(lru);
            free(lru);
            cache->size--;
        }
        Node* new_node = (Node*)malloc(sizeof(Node));
        new_node->key = key;
        new_node->value = value;
        add_to_head(cache, new_node);
        cache->size++;
    }
}

static void free_cache(LRUCache* cache) {
    Node* cur = cache->head;
    while (cur != NULL) {
        Node* next = cur->next;
        free(cur);
        cur = next;
    }
    free(cache->buckets);
    free(cache);
}

int lru_cache(int operations[], int size) {
    int capacity = operations[0];
    int op_count = operations[1];
    LRUCache* cache = create_cache(capacity);
    int result_sum = 0;
    int idx = 2;

    for (int i = 0; i < op_count; i++) {
        int op_type = operations[idx];
        int key = operations[idx + 1];
        int value = operations[idx + 2];
        idx += 3;

        if (op_type == 1) {
            cache_put(cache, key, value);
        } else if (op_type == 2) {
            result_sum += cache_get(cache, key);
        }
    }

    free_cache(cache);
    return result_sum;
}
