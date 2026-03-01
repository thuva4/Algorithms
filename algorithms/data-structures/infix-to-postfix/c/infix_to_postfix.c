#include <ctype.h>

static int precedence(char op) {
    if (op == '^') return 3;
    if (op == '*' || op == '/') return 2;
    if (op == '+' || op == '-') return 1;
    return 0;
}

static int right_associative(char op) {
    return op == '^';
}

char *infix_to_postfix(const char *expression) {
    static char output[10000];
    char stack[10000];
    int out = 0;
    int top = -1;

    for (int i = 0; expression[i] != '\0'; i++) {
        char ch = expression[i];
        if (isspace((unsigned char)ch)) {
            continue;
        }
        if (isalnum((unsigned char)ch)) {
            output[out++] = ch;
        } else if (ch == '(') {
            stack[++top] = ch;
        } else if (ch == ')') {
            while (top >= 0 && stack[top] != '(') {
                output[out++] = stack[top--];
            }
            if (top >= 0 && stack[top] == '(') {
                top--;
            }
        } else {
            while (
                top >= 0 &&
                stack[top] != '(' &&
                (
                    precedence(stack[top]) > precedence(ch) ||
                    (
                        precedence(stack[top]) == precedence(ch) &&
                        !right_associative(ch)
                    )
                )
            ) {
                output[out++] = stack[top--];
            }
            stack[++top] = ch;
        }
    }

    while (top >= 0) {
        if (stack[top] != '(') {
            output[out++] = stack[top];
        }
        top--;
    }

    output[out] = '\0';
    return output;
}
