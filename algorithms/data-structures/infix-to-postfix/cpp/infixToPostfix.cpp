#include <cctype>
#include <stack>
#include <string>

namespace {
int precedence(char op) {
    if (op == '^') {
        return 3;
    }
    if (op == '*' || op == '/') {
        return 2;
    }
    if (op == '+' || op == '-') {
        return 1;
    }
    return 0;
}

bool is_right_associative(char op) {
    return op == '^';
}
}  // namespace

std::string infix_to_postfix(const std::string& expression) {
    std::string output;
    std::stack<char> operators;

    for (char token : expression) {
        if (std::isalnum(static_cast<unsigned char>(token))) {
            output.push_back(token);
            continue;
        }

        if (token == '(' || token == '[' || token == '{') {
            operators.push(token);
            continue;
        }

        if (token == ')' || token == ']' || token == '}') {
            char opening = token == ')' ? '(' : (token == ']' ? '[' : '{');
            while (!operators.empty() && operators.top() != opening) {
                output.push_back(operators.top());
                operators.pop();
            }
            if (!operators.empty()) {
                operators.pop();
            }
            continue;
        }

        while (!operators.empty()) {
            char top = operators.top();
            if (top == '(' || top == '[' || top == '{') {
                break;
            }

            int top_precedence = precedence(top);
            int current_precedence = precedence(token);
            bool should_pop = top_precedence > current_precedence;
            if (!is_right_associative(token) && top_precedence == current_precedence) {
                should_pop = true;
            }
            if (!should_pop) {
                break;
            }

            output.push_back(top);
            operators.pop();
        }

        operators.push(token);
    }

    while (!operators.empty()) {
        output.push_back(operators.top());
        operators.pop();
    }

    return output;
}
