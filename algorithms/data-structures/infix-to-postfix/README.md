# Infix to Postfix Conversion

## Overview

Infix to Postfix conversion (also known as the Shunting Yard algorithm) transforms mathematical expressions from infix notation (where operators are between operands, e.g., `3 + 4 * 2`) to postfix notation (also called Reverse Polish Notation or RPN, where operators follow their operands, e.g., `3 4 2 * +`). This conversion is essential for expression evaluation by computers because postfix expressions can be evaluated left-to-right without parentheses or precedence rules using a simple stack.

The Shunting Yard algorithm was invented by Edsger Dijkstra in 1961 and is named by analogy with a railroad shunting yard, where cars are sorted onto different tracks.

## How It Works

The algorithm uses an operator stack and an output queue:

1. **Scan the expression left to right.** For each token:
   - **Operand (number)**: Send directly to the output.
   - **Operator (e.g., +, -, *, /)**: While the stack is not empty and the top of the stack has an operator of greater or equal precedence (and is left-associative), pop from the stack to the output. Then push the current operator onto the stack.
   - **Left parenthesis `(`**: Push onto the stack.
   - **Right parenthesis `)`**: Pop from the stack to the output until a left parenthesis is encountered. Discard the left parenthesis.

2. **After scanning all tokens**: Pop all remaining operators from the stack to the output.

### Operator Precedence (standard)

| Precedence | Operators    | Associativity |
|-----------|-------------|---------------|
| 3 (high)  | ^           | Right         |
| 2         | *, /        | Left          |
| 1 (low)   | +, -        | Left          |

## Worked Example

Convert `3 + 4 * 2 / (1 - 5)` to postfix:

| Token | Action | Output Queue | Operator Stack |
|-------|--------|-------------|----------------|
| 3     | Output | `3` | |
| +     | Push | `3` | `+` |
| 4     | Output | `3 4` | `+` |
| *     | * > +, push | `3 4` | `+ *` |
| 2     | Output | `3 4 2` | `+ *` |
| /     | / = *, pop *, push / | `3 4 2 *` | `+ /` |
| (     | Push | `3 4 2 *` | `+ / (` |
| 1     | Output | `3 4 2 * 1` | `+ / (` |
| -     | Push | `3 4 2 * 1` | `+ / ( -` |
| 5     | Output | `3 4 2 * 1 5` | `+ / ( -` |
| )     | Pop until ( | `3 4 2 * 1 5 -` | `+ /` |
| End   | Pop all | `3 4 2 * 1 5 - / +` | |

Result: `3 4 2 * 1 5 - / +`

**Verification**: Evaluate the postfix expression with a stack:
- Push 3, 4, 2. Pop 2 and 4, compute 4*2=8, push 8. Stack: [3, 8]
- Push 1, 5. Pop 5 and 1, compute 1-5=-4, push -4. Stack: [3, 8, -4]
- Pop -4 and 8, compute 8/(-4)=-2, push -2. Stack: [3, -2]
- Pop -2 and 3, compute 3+(-2)=1, push 1. Stack: [1]
- Result: 1

## Pseudocode

```
function infixToPostfix(expression):
    output = empty queue
    operators = empty stack

    for each token in expression:
        if token is a number:
            output.enqueue(token)

        else if token is an operator:
            while operators is not empty
                  and top of operators is not '('
                  and (precedence(top) > precedence(token)
                       or (precedence(top) == precedence(token)
                           and token is left-associative)):
                output.enqueue(operators.pop())
            operators.push(token)

        else if token is '(':
            operators.push(token)

        else if token is ')':
            while top of operators is not '(':
                output.enqueue(operators.pop())
            operators.pop()    // discard the '('

    while operators is not empty:
        output.enqueue(operators.pop())

    return output
```

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(n) | O(n)  |
| Average | O(n) | O(n)  |
| Worst   | O(n) | O(n)  |

**Why these complexities?**

- **Time -- O(n):** Each token is processed exactly once during the scan. Each operator is pushed onto the stack at most once and popped at most once, so the total number of stack operations across the entire expression is O(n). Even though the inner while loop may pop multiple operators for a single token, the total number of pops over the entire algorithm cannot exceed n.

- **Space -- O(n):** The operator stack and output queue together hold all n tokens at any point. In the worst case (deeply nested parentheses), the stack may hold O(n) operators.

## Applications

- **Compilers and interpreters**: Expression parsing in compilers converts infix source code to postfix (or a related intermediate representation) for code generation. The postfix form maps directly to stack-based virtual machine instructions.
- **Calculator applications**: Scientific and programmable calculators evaluate expressions by first converting to postfix, then evaluating with a stack.
- **Spreadsheet formulas**: Excel and Google Sheets parse cell formulas (infix) into an internal postfix representation for evaluation.
- **Expression trees**: Postfix expressions can be trivially converted to expression trees (binary trees where leaves are operands and internal nodes are operators), which are used in query optimizers and symbolic computation.

## When NOT to Use

- **When expression trees are needed directly**: If the goal is to build an AST (Abstract Syntax Tree), a recursive descent parser or Pratt parser may be more natural and produce the tree directly without the postfix intermediate step.
- **For simple expressions with no precedence**: If all operators have the same precedence and there are no parentheses, the conversion is unnecessary; the expression can be evaluated left to right.
- **When the expression is already in postfix or prefix**: No conversion needed.

## Comparison with Similar Approaches

| Method              | Output        | Handles Precedence | Handles Associativity | Complexity |
|--------------------|--------------|-------------------|-----------------------|-----------|
| Shunting Yard       | Postfix      | Yes               | Yes                   | O(n)      |
| Recursive Descent   | AST          | Yes               | Yes                   | O(n)      |
| Pratt Parser        | AST          | Yes               | Yes                   | O(n)      |
| Simple Left-to-Right| Value        | No                | No                    | O(n)      |

## Implementations

| Language | File |
|----------|------|
| C++      | [infixToPostfix.cpp](cpp/infixToPostfix.cpp) |

## References

- Dijkstra, E. W. (1961). Algol 60 translation: An algol 60 translator for the x1. *Mathematisch Centrum*, Amsterdam.
- Aho, A. V., Lam, M. S., Sethi, R., & Ullman, J. D. (2006). *Compilers: Principles, Techniques, and Tools* (2nd ed.). Pearson. Section 2.5: Translating Expressions.
- Knuth, D. E. (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.). Addison-Wesley. Section 2.2.1.
- [Shunting Yard Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Shunting-yard_algorithm)
