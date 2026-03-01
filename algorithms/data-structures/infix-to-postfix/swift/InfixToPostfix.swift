import Foundation

func infixToPostfix(_ expression: String) -> String {
    func precedence(_ op: Character) -> Int {
        switch op {
        case "^": return 3
        case "*", "/": return 2
        case "+", "-": return 1
        default: return 0
        }
    }

    func isRightAssociative(_ op: Character) -> Bool {
        op == "^"
    }

    var output = ""
    var stack: [Character] = []

    for ch in expression {
        if ch.isLetter || ch.isNumber {
            output.append(ch)
        } else if ch == "(" {
            stack.append(ch)
        } else if ch == ")" {
            while let top = stack.last, top != "(" {
                output.append(stack.removeLast())
            }
            if stack.last == "(" {
                stack.removeLast()
            }
        } else {
            while let top = stack.last, top != "(" {
                let topPrecedence = precedence(top)
                let currentPrecedence = precedence(ch)
                if topPrecedence > currentPrecedence || (topPrecedence == currentPrecedence && !isRightAssociative(ch)) {
                    output.append(stack.removeLast())
                } else {
                    break
                }
            }
            stack.append(ch)
        }
    }

    while let top = stack.popLast() {
        if top != "(" {
            output.append(top)
        }
    }

    return output
}
