#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define MAX_CHARS 26
#define MAX_STATES 1000

int goTo[MAX_STATES][MAX_CHARS];
int fail[MAX_STATES];
int out[MAX_STATES];
int stateCount;

void initAutomaton() {
    memset(goTo, -1, sizeof(goTo));
    memset(fail, 0, sizeof(fail));
    memset(out, 0, sizeof(out));
    stateCount = 1;
}

void addPattern(const char *pattern, int index) {
    int cur = 0;
    for (int i = 0; pattern[i]; i++) {
        int c = pattern[i] - 'a';
        if (goTo[cur][c] == -1) {
            goTo[cur][c] = stateCount++;
        }
        cur = goTo[cur][c];
    }
    out[cur] |= (1 << index);
}

void buildFailLinks() {
    int queue[MAX_STATES];
    int front = 0, back = 0;

    for (int c = 0; c < MAX_CHARS; c++) {
        if (goTo[0][c] != -1) {
            fail[goTo[0][c]] = 0;
            queue[back++] = goTo[0][c];
        } else {
            goTo[0][c] = 0;
        }
    }

    while (front < back) {
        int u = queue[front++];
        for (int c = 0; c < MAX_CHARS; c++) {
            if (goTo[u][c] != -1) {
                int v = goTo[u][c];
                int f = fail[u];
                while (f && goTo[f][c] == -1) f = fail[f];
                fail[v] = goTo[f][c];
                if (fail[v] == v) fail[v] = 0;
                out[v] |= out[fail[v]];
                queue[back++] = v;
            }
        }
    }
}

void search(const char *text, const char **patterns, int numPatterns) {
    int cur = 0;
    for (int i = 0; text[i]; i++) {
        int c = text[i] - 'a';
        while (cur && goTo[cur][c] == -1) cur = fail[cur];
        if (goTo[cur][c] != -1) cur = goTo[cur][c];
        if (out[cur]) {
            for (int j = 0; j < numPatterns; j++) {
                if (out[cur] & (1 << j)) {
                    int start = i - (int)strlen(patterns[j]) + 1;
                    printf("Word \"%s\" found at index %d\n", patterns[j], start);
                }
            }
        }
    }
}

char *aho_corasick_search(const char *text, const char *patterns_line) {
    static char output[100000];
    static char pattern_storage[128][64];
    const char *patterns[128];
    char buffer[100000];
    int numPatterns = 0;

    strncpy(buffer, patterns_line, sizeof(buffer) - 1);
    buffer[sizeof(buffer) - 1] = '\0';

    char *tok = strtok(buffer, " ");
    while (tok && numPatterns < 128) {
        strncpy(pattern_storage[numPatterns], tok, sizeof(pattern_storage[numPatterns]) - 1);
        pattern_storage[numPatterns][sizeof(pattern_storage[numPatterns]) - 1] = '\0';
        patterns[numPatterns] = pattern_storage[numPatterns];
        numPatterns++;
        tok = strtok(NULL, " ");
    }

    initAutomaton();
    for (int i = 0; i < numPatterns; i++) {
        addPattern(patterns[i], i);
    }
    buildFailLinks();

    int cur = 0;
    int offset = 0;
    output[0] = '\0';

    for (int i = 0; text[i]; i++) {
        int c = text[i] - 'a';
        if (c < 0 || c >= MAX_CHARS) {
            cur = 0;
            continue;
        }
        while (cur && goTo[cur][c] == -1) {
            cur = fail[cur];
        }
        if (goTo[cur][c] != -1) {
            cur = goTo[cur][c];
        }
        if (out[cur]) {
            for (int j = 0; j < numPatterns; j++) {
                if (out[cur] & (1 << j)) {
                    int start = i - (int)strlen(patterns[j]) + 1;
                    offset += snprintf(output + offset, sizeof(output) - (size_t)offset, "%s%s:%d",
                        offset == 0 ? "" : " ", patterns[j], start);
                }
            }
        }
    }

    return output;
}

int main() {
    const char *patterns[] = {"he", "she", "his", "hers"};
    int numPatterns = 4;

    initAutomaton();
    for (int i = 0; i < numPatterns; i++) {
        addPattern(patterns[i], i);
    }
    buildFailLinks();
    search("ahishers", patterns, numPatterns);

    return 0;
}
