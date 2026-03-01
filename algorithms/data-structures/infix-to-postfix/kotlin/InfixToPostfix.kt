fun infixToPostfix(expression: String): String {
    if (expression.isEmpty()) {
        return ""
    }

    fun precedence(ch: Char): Int = when (ch) {
        '^' -> 3
        '*', '/' -> 2
        '+', '-' -> 1
        else -> 0
    }

    fun isRightAssociative(ch: Char): Boolean = ch == '^'

    val output = StringBuilder()
    val operators = ArrayDeque<Char>()

    for (ch in expression) {
        when {
            ch.isLetterOrDigit() -> output.append(ch)
            ch == '(' -> operators.addLast(ch)
            ch == ')' -> {
                while (operators.isNotEmpty() && operators.last() != '(') {
                    output.append(operators.removeLast())
                }
                if (operators.isNotEmpty() && operators.last() == '(') {
                    operators.removeLast()
                }
            }
            else -> {
                while (
                    operators.isNotEmpty() &&
                    operators.last() != '(' &&
                    (
                        precedence(operators.last()) > precedence(ch) ||
                            (
                                precedence(operators.last()) == precedence(ch) &&
                                    !isRightAssociative(ch)
                                )
                        )
                ) {
                    output.append(operators.removeLast())
                }
                operators.addLast(ch)
            }
        }
    }

    while (operators.isNotEmpty()) {
        val op = operators.removeLast()
        if (op != '(') {
            output.append(op)
        }
    }

    return output.toString()
}
