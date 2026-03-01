fn precedence(operator: char) -> i32 {
    match operator {
        '^' => 3,
        '*' | '/' => 2,
        '+' | '-' => 1,
        _ => 0,
    }
}

fn is_right_associative(operator: char) -> bool {
    operator == '^'
}

pub fn infix_to_postfix(expression: &str) -> String {
    let mut output = String::new();
    let mut operators: Vec<char> = Vec::new();

    for ch in expression.chars() {
        if ch.is_ascii_alphanumeric() {
            output.push(ch);
        } else if ch == '(' {
            operators.push(ch);
        } else if ch == ')' {
            while let Some(operator) = operators.pop() {
                if operator == '(' {
                    break;
                }
                output.push(operator);
            }
        } else {
            while let Some(&top) = operators.last() {
                if top == '(' {
                    break;
                }
                let higher_precedence = precedence(top) > precedence(ch);
                let same_precedence = precedence(top) == precedence(ch);
                if higher_precedence || (same_precedence && !is_right_associative(ch)) {
                    output.push(operators.pop().unwrap_or_default());
                } else {
                    break;
                }
            }
            operators.push(ch);
        }
    }

    while let Some(operator) = operators.pop() {
        if operator != '(' {
            output.push(operator);
        }
    }

    output
}
