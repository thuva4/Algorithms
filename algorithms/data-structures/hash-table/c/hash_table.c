#include "hash_table.h"
#include <stdlib.h>

#define TABLE_SIZE 64

typedef struct Entry {
    int key;
    int value;
    struct Entry* next;
} Entry;

typedef struct {
    Entry* buckets[TABLE_SIZE];
} HashTableImpl;

static int hash_key(int key) {
    return abs(key) % TABLE_SIZE;
}

static HashTableImpl* create_table(void) {
    HashTableImpl* table = (HashTableImpl*)calloc(1, sizeof(HashTableImpl));
    return table;
}

static void table_put(HashTableImpl* table, int key, int value) {
    int idx = hash_key(key);
    Entry* cur = table->buckets[idx];
    while (cur != NULL) {
        if (cur->key == key) {
            cur->value = value;
            return;
        }
        cur = cur->next;
    }
    Entry* entry = (Entry*)malloc(sizeof(Entry));
    entry->key = key;
    entry->value = value;
    entry->next = table->buckets[idx];
    table->buckets[idx] = entry;
}

static int table_get(HashTableImpl* table, int key) {
    int idx = hash_key(key);
    Entry* cur = table->buckets[idx];
    while (cur != NULL) {
        if (cur->key == key) {
            return cur->value;
        }
        cur = cur->next;
    }
    return -1;
}

static void table_delete(HashTableImpl* table, int key) {
    int idx = hash_key(key);
    Entry* cur = table->buckets[idx];
    Entry* prev = NULL;
    while (cur != NULL) {
        if (cur->key == key) {
            if (prev == NULL) {
                table->buckets[idx] = cur->next;
            } else {
                prev->next = cur->next;
            }
            free(cur);
            return;
        }
        prev = cur;
        cur = cur->next;
    }
}

static void free_table(HashTableImpl* table) {
    for (int i = 0; i < TABLE_SIZE; i++) {
        Entry* cur = table->buckets[i];
        while (cur != NULL) {
            Entry* next = cur->next;
            free(cur);
            cur = next;
        }
    }
    free(table);
}

int hash_table_ops(int operations[], int size) {
    HashTableImpl* table = create_table();
    int op_count = operations[0];
    int result_sum = 0;
    int idx = 1;

    for (int i = 0; i < op_count; i++) {
        int op_type = operations[idx];
        int key = operations[idx + 1];
        int value = operations[idx + 2];
        idx += 3;

        if (op_type == 1) {
            table_put(table, key, value);
        } else if (op_type == 2) {
            result_sum += table_get(table, key);
        } else if (op_type == 3) {
            table_delete(table, key);
        }
    }

    free_table(table);
    return result_sum;
}
