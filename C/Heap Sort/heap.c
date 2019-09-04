#include <stdlib.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include "heap.h"

heap_ctrl_t * hp_create(size_t size) {
    heap_ctrl_t * h = (heap_ctrl_t *) calloc(1, sizeof(heap_ctrl_t));
    h->array = (data_t **) calloc(size, sizeof(data_t *));
    h->size = size;
    return h;
}

void hp_destroy(heap_ctrl_t ** heap) {
    if (*heap == (heap_ctrl_t *) NULL)
	return;

    memset((*heap)->array, 0x00, (*heap)->size * sizeof(data_t *));
    free((*heap)->array);

    memset(*heap, 0x00, sizeof(heap_ctrl_t));
    free(*heap);

    heap = NULL;
}

int32_t hp_insert(heap_ctrl_t * heap, int32_t data) {
    if (heap == (heap_ctrl_t *) NULL)
	return ERR_HEAP_NULL;

    if (heap->next == heap->size - 1)
	return ERR_HEAP_FULL;

    int32_t parent, leaf;
    data_t * datas = (data_t *) calloc(1, sizeof(data_t));
    datas->data = data;

    heap->array[heap->next] = datas;
    parent = heap->next;
    leaf = heap->next;

    while (parent != 0) {
	if (parent % 2 == 0)
	    parent = (parent - 2) / 2;
	else
	    parent = (parent - 1) / 2;


	if (heap->array[parent]->data <= data) {
	    heap->array[leaf] = heap->array[parent];
	    heap->array[parent] = datas;
	    leaf = parent;
	}
    }
    ++heap->next;

    return SUCCESS;
}

int32_t hp_remove(heap_ctrl_t * heap) {
    if (heap == (heap_ctrl_t *) NULL)
	return ERR_HEAP_NULL;

    if (heap->next == 0)
	return ERR_HEAP_EMPTY;

    if (heap->array[0] != (data_t *) NULL)
	free(heap->array[0]);

    --heap->next;
    heap->array[0] = heap->array[heap->next];
    heap->array[heap->next] = (data_t *) NULL;

    hp_heapfy(heap);

    return SUCCESS;
}

int32_t hp_heapfy(heap_ctrl_t * heap) {
    if (heap == (heap_ctrl_t *) NULL)
	return ERR_HEAP_NULL;

    size_t l, r;
    int32_t parent = 0;

    while (1) {
	l = LEFT(parent);
	r = RIGHT(parent);

	if (heap->array[r] == (data_t *) NULL) {
	    if (heap->array[l] == (data_t *) NULL)
		break;
	    if (heap->array[l]->data >= heap->array[parent]->data) {
		hp_swap(&(heap)->array[l], &(heap)->array[parent]);
		parent = l;
	     } else {
		break;
	    }
	} else {
	    if ((heap->array[l]->data >= heap->array[parent]->data) && (heap->array[l]->data > heap->array[r]->data)) {
		hp_swap(&(heap)->array[l], &(heap)->array[parent]);
		parent = l;
	    } else if ((heap->array[r]->data >= heap->array[parent]->data) && (heap->array[r]->data > heap->array[l]->data)) {
		hp_swap(&(heap)->array[r], &(heap)->array[parent]);
		parent = r;
	    } else {
		break;
	    }
	}
    }

    return SUCCESS;
}

void hp_swap(data_t ** a, data_t ** b) {
    data_t * tmp;
    tmp = *a;
    *a = *b;
    *b = tmp;
}

int32_t hp_sort(heap_ctrl_t * heap) {
    if (heap == (heap_ctrl_t *) NULL)
	return ERR_HEAP_NULL;

    data_t ** sorted = (data_t **) calloc(heap->size, sizeof(data_t *));

    int32_t i;

    for (i = (heap->next - 1); i >= 0; --i) {
	sorted[i] = heap->array[0];
	heap->array[0] = heap->array[i];
	heap->array[i] = (data_t *) NULL;

	hp_heapfy(heap);
    }

    for (i = 0; i < (int32_t) heap->next; ++i)
	heap->array[i] = sorted[i];

    memset(sorted, 0x00, heap->size * sizeof(data_t *));
    free(sorted);

    return SUCCESS;
}

int32_t hp_get_head(heap_ctrl_t * heap) {
    if (heap == (heap_ctrl_t *) NULL)
	return ERR_HEAP_NULL;
    if (heap->next == 0)
	return ERR_HEAP_EMPTY;

    return heap->array[0]->data;
}

void hp_print(heap_ctrl_t * heap) {
    if (heap == (heap_ctrl_t *) NULL)
	return;

    size_t i;

    printf("[");
    for (i = 0; i < heap->next + 1; ++i) {
	if (heap->array[i] != (data_t *) NULL)
	    printf("%d ", heap->array[i]->data);
    }
    printf("]\n");
}
