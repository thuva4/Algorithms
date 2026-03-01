def infix_to_postfix(expression: str) -> str:
    precedence = {"+": 1, "-": 1, "*": 2, "/": 2, "^": 3}
    output: list[str] = []
    operators: list[str] = []

    for char in expression:
        if char.isalnum():
            output.append(char)
        elif char == "(":
            operators.append(char)
        elif char == ")":
            while operators and operators[-1] != "(":
                output.append(operators.pop())
            if operators and operators[-1] == "(":
                operators.pop()
        else:
            while operators and operators[-1] != "(":
                top = operators[-1]
                if precedence.get(top, 0) > precedence.get(char, 0):
                    output.append(operators.pop())
                elif precedence.get(top, 0) == precedence.get(char, 0) and char != "^":
                    output.append(operators.pop())
                else:
                    break
            operators.append(char)

    while operators:
        output.append(operators.pop())
    return "".join(output)
