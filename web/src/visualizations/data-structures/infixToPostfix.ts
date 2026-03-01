import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  reading: '#eab308',
  operand: '#22c55e',
  operator: '#ef4444',
  stackPush: '#3b82f6',
  stackPop: '#8b5cf6',
  output: '#22c55e',
  paren: '#f97316',
};

export class InfixToPostfixVisualization implements AlgorithmVisualization {
  name = 'Infix to Postfix';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Build an infix expression from the input data
    // Use first few numbers as operands and interleave operators
    const operators = ['+', '-', '*', '/', '+', '*', '-'];
    const values = data.slice(0, Math.min(data.length, 7)).map(v => Math.abs(v) % 20 + 1);

    // Build infix tokens: a + b * c - d
    const tokens: string[] = [];
    for (let i = 0; i < values.length; i++) {
      tokens.push(String(values[i]));
      if (i < values.length - 1) {
        tokens.push(operators[i % operators.length]);
      }
    }

    // Add parentheses for interest if enough operands
    if (values.length >= 4) {
      tokens.splice(2, 0, '(');
      tokens.splice(6, 0, ')');
    }

    const precedence: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2 };
    const isOperator = (t: string) => t in precedence;

    // Encode: each token gets a position in the data array
    // data array shows the state: [token_values..., stack_values..., output_values...]
    const maxLen = tokens.length + tokens.length + tokens.length;
    const operatorStack: string[] = [];
    const outputQueue: string[] = [];

    const buildData = (): number[] => {
      const arr = new Array(maxLen).fill(0);
      // First section: remaining tokens
      for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        arr[i] = isOperator(t) ? precedence[t] * 10 : (t === '(' || t === ')') ? 5 : parseInt(t) || 0;
      }
      // Middle section: stack
      for (let i = 0; i < operatorStack.length; i++) {
        const t = operatorStack[i];
        arr[tokens.length + i] = isOperator(t) ? precedence[t] * 10 : 5;
      }
      // Last section: output
      for (let i = 0; i < outputQueue.length; i++) {
        const t = outputQueue[i];
        arr[tokens.length * 2 + i] = parseInt(t) || (isOperator(t) ? precedence[t] * 10 : 0);
      }
      return arr.slice(0, Math.max(data.length, 16));
    };

    this.steps.push({
      data: buildData(),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Shunting-yard algorithm. Infix expression: ${tokens.join(' ')}. Converting to postfix notation.`,
    });

    // Process each token
    let tokenIndex = 0;
    const processedTokens = [...tokens];

    for (const token of processedTokens) {
      this.steps.push({
        data: buildData(),
        highlights: [
          { index: tokenIndex, color: COLORS.reading, label: token },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Reading token: "${token}". Stack: [${operatorStack.join(', ')}]. Output: [${outputQueue.join(', ')}].`,
      });

      if (!isNaN(parseInt(token))) {
        // Operand: add to output
        outputQueue.push(token);

        this.steps.push({
          data: buildData(),
          highlights: [
            { index: tokenIndex, color: COLORS.operand, label: token },
          ],
          comparisons: [],
          swaps: [],
          sorted: Array.from({ length: outputQueue.length }, (_, i) => tokens.length * 2 + i).filter(i => i < buildData().length),
          stepDescription: `"${token}" is an operand. Push to output queue. Output: [${outputQueue.join(', ')}].`,
        });
      } else if (token === '(') {
        operatorStack.push(token);

        this.steps.push({
          data: buildData(),
          highlights: [
            { index: tokenIndex, color: COLORS.paren, label: '(' },
          ],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Left parenthesis "(". Push to operator stack. Stack: [${operatorStack.join(', ')}].`,
        });
      } else if (token === ')') {
        // Pop until matching '('
        while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
          const popped = operatorStack.pop()!;
          outputQueue.push(popped);

          this.steps.push({
            data: buildData(),
            highlights: [
              { index: tokenIndex, color: COLORS.paren, label: ')' },
            ],
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `Right parenthesis ")". Pop "${popped}" from stack to output. Stack: [${operatorStack.join(', ')}]. Output: [${outputQueue.join(', ')}].`,
          });
        }
        if (operatorStack.length > 0) {
          operatorStack.pop(); // Remove the '('

          this.steps.push({
            data: buildData(),
            highlights: [
              { index: tokenIndex, color: COLORS.paren, label: ')' },
            ],
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `Discarded matching "(". Stack: [${operatorStack.join(', ')}].`,
          });
        }
      } else if (isOperator(token)) {
        // Pop operators with higher or equal precedence
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1] !== '(' &&
          isOperator(operatorStack[operatorStack.length - 1]) &&
          precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
        ) {
          const popped = operatorStack.pop()!;
          outputQueue.push(popped);

          this.steps.push({
            data: buildData(),
            highlights: [],
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `"${token}" has precedence ${precedence[token]}. Top of stack "${popped}" has precedence ${precedence[popped]} (>=). Pop "${popped}" to output. Output: [${outputQueue.join(', ')}].`,
          });
        }

        operatorStack.push(token);

        this.steps.push({
          data: buildData(),
          highlights: [
            { index: tokenIndex, color: COLORS.stackPush, label: token },
          ],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Push operator "${token}" (precedence ${precedence[token]}) onto stack. Stack: [${operatorStack.join(', ')}].`,
        });
      }

      tokenIndex++;
    }

    // Pop remaining operators
    while (operatorStack.length > 0) {
      const popped = operatorStack.pop()!;
      if (popped !== '(' && popped !== ')') {
        outputQueue.push(popped);
      }

      this.steps.push({
        data: buildData(),
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Flushing stack: pop "${popped}" to output. Stack: [${operatorStack.join(', ')}]. Output: [${outputQueue.join(', ')}].`,
      });
    }

    this.steps.push({
      data: buildData(),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: outputQueue.length }, (_, i) => i),
      stepDescription: `Conversion complete! Infix: ${processedTokens.join(' ')} => Postfix: ${outputQueue.join(' ')}. Shunting-yard runs in O(n).`,
    });

    return this.steps[0];
  }

  step(): VisualizationState | null {
    this.currentStepIndex++;
    if (this.currentStepIndex >= this.steps.length) {
      this.currentStepIndex = this.steps.length;
      return null;
    }
    return this.steps[this.currentStepIndex];
  }

  reset(): void {
    this.currentStepIndex = -1;
  }

  getStepCount(): number {
    return this.steps.length;
  }

  getCurrentStep(): number {
    return this.currentStepIndex;
  }
}
