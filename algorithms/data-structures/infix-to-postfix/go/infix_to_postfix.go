package infixtopostfix

import "strings"

// infix_to_postfix converts an infix expression into postfix form.
func infix_to_postfix(expression string) string {
	var output strings.Builder
	stack := make([]rune, 0, len(expression))

	for _, ch := range expression {
		switch {
		case isOperand(ch):
			output.WriteRune(ch)
		case ch == '(':
			stack = append(stack, ch)
		case ch == ')':
			for len(stack) > 0 && stack[len(stack)-1] != '(' {
				output.WriteRune(stack[len(stack)-1])
				stack = stack[:len(stack)-1]
			}
			if len(stack) > 0 && stack[len(stack)-1] == '(' {
				stack = stack[:len(stack)-1]
			}
		case ch == ' ' || ch == '\t' || ch == '\n' || ch == '\r':
			continue
		default:
			for len(stack) > 0 && stack[len(stack)-1] != '(' {
				top := stack[len(stack)-1]
				topPrecedence := precedence(top)
				currentPrecedence := precedence(ch)
				if topPrecedence > currentPrecedence || (topPrecedence == currentPrecedence && ch != '^') {
					output.WriteRune(top)
					stack = stack[:len(stack)-1]
					continue
				}
				break
			}
			stack = append(stack, ch)
		}
	}

	for len(stack) > 0 {
		ch := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		if ch != '(' {
			output.WriteRune(ch)
		}
	}

	return output.String()
}

// InfixToPostfix is an exported alias for infix_to_postfix.
func InfixToPostfix(expression string) string {
	return infix_to_postfix(expression)
}

func isOperand(ch rune) bool {
	return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9')
}

func precedence(operator rune) int {
	switch operator {
	case '^':
		return 3
	case '*', '/':
		return 2
	case '+', '-':
		return 1
	default:
		return 0
	}
}
