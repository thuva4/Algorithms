import java.util.ArrayDeque;
import java.util.Deque;

public class InfixToPostfix {
    public static String infixToPostfix(String expression) {
        StringBuilder output = new StringBuilder();
        Deque<Character> stack = new ArrayDeque<>();

        for (int i = 0; i < expression.length(); i++) {
            char ch = expression.charAt(i);
            if (Character.isLetterOrDigit(ch)) {
                output.append(ch);
            } else if (ch == '(') {
                stack.push(ch);
            } else if (ch == ')') {
                while (!stack.isEmpty() && stack.peek() != '(') {
                    output.append(stack.pop());
                }
                if (!stack.isEmpty() && stack.peek() == '(') {
                    stack.pop();
                }
            } else {
                while (!stack.isEmpty() && stack.peek() != '(') {
                    char top = stack.peek();
                    int topPrecedence = precedence(top);
                    int currentPrecedence = precedence(ch);
                    if (topPrecedence > currentPrecedence || (topPrecedence == currentPrecedence && ch != '^')) {
                        output.append(stack.pop());
                    } else {
                        break;
                    }
                }
                stack.push(ch);
            }
        }

        while (!stack.isEmpty()) {
            char ch = stack.pop();
            if (ch != '(') {
                output.append(ch);
            }
        }

        return output.toString();
    }

    private static int precedence(char operator) {
        switch (operator) {
            case '^':
                return 3;
            case '*':
            case '/':
                return 2;
            case '+':
            case '-':
                return 1;
            default:
                return 0;
        }
    }
}
