#include <stddef.h>
#include <string.h>
#include <alloca.h>
#include <stdio.h>
#include <stdbool.h>

bool get_bit(char *ptr, size_t offset)
{
    return (((*(ptr + offset / 8)) >> (offset % 8)) & 1);
}

void set_bit(char *ptr, size_t offset, bool value)
{
    char temp = (*(ptr + offset / 8)) & (~(1 << offset % 8));

    temp |= (value << offset % 8);
    (*(ptr + offset / 8)) = temp;
}

void print_sieve(char *buffer, size_t size)
{
    for (size_t i = 0; i < size; i += 1) {
        if (get_bit(buffer, i) == 0)
            printf("%li\n", i + 2);
    }
}

void erathostene(size_t limit)
{
    size_t buf_size = (limit < 8 ? 1 : limit / 8);
    char *buffer = alloca(limit);

    memset(buffer, 0, buf_size);
    for (size_t i = 2; i < limit; i += 1) {
        size_t idx = i - 2;
        if (get_bit(buffer, i) == 0) {
            for (size_t j = idx + i; j < limit; j += i) {
                if ((j + 2) % i == 0) {
                    set_bit(buffer, j, 1);
                }
            }
        }
    }
    print_sieve(buffer, limit);
}
