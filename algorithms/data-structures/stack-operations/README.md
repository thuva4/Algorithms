# Stack

## Overview

A Stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle. Elements are added (pushed) and removed (popped) from the same end, called the top. Think of a stack of plates: you can only add or remove plates from the top of the pile.

Stacks are one of the most fundamental and widely used data structures in computer science. They can be implemented with arrays (using a top-of-stack pointer) or linked lists (where the head is the top). This implementation processes a sequence of push and pop operations and returns the sum of all popped values.

## How It Works

1. **Push**: Add an element to the top of the stack. In an array-based implementation, increment the top pointer and store the value. In a linked-list implementation, create a new node and make it the new head.
2. **Pop**: Remove and return the top element. Decrement the top pointer (array) or advance the head to the next node (linked list). If the stack is empty, return -1 or signal an error.
3. **Peek/Top**: Return the top element without removing it.
4. **isEmpty**: Check whether the stack has no elements.

Operations are encoded as a flat array: `[op_count, type, val, ...]` where type 1 = push value, type 2 = pop (val ignored, returns -1 if empty). The function returns the sum of all popped values.

## Example

**Step-by-step trace** with input `[4, 1,5, 1,3, 2,0, 2,0]`:

```
Operation 1: PUSH 5
  Stack (bottom -> top): [5]

Operation 2: PUSH 3
  Stack: [5, 3]

Operation 3: POP
  Remove top element: 3
  Stack: [5]

Operation 4: POP
  Remove top element: 5
  Stack: []

Sum of popped values = 3 + 5 = 8
```

**Another example** showing LIFO order with input `[8, 1,10, 1,20, 1,30, 2,0, 1,40, 2,0, 2,0, 2,0]`:

```
PUSH 10   -> Stack: [10]
PUSH 20   -> Stack: [10, 20]
PUSH 30   -> Stack: [10, 20, 30]
POP       -> Returns 30, Stack: [10, 20]
PUSH 40   -> Stack: [10, 20, 40]
POP       -> Returns 40, Stack: [10, 20]
POP       -> Returns 20, Stack: [10]
POP       -> Returns 10, Stack: []

Sum = 30 + 40 + 20 + 10 = 100
```

**Example: checking balanced parentheses (classic stack application):**

```
Input: "({[]})"

Process each character:
  '(' -> push '('     Stack: ['(']
  '{' -> push '{'     Stack: ['(', '{']
  '[' -> push '['     Stack: ['(', '{', '[']
  ']' -> pop '[', matches '['  Stack: ['(', '{']
  '}' -> pop '{', matches '{'  Stack: ['(']
  ')' -> pop '(', matches '('  Stack: []

Stack is empty at end -> parentheses are balanced!
```

## Pseudocode

```
class Stack:
    top = -1
    data = []

    function push(value):
        top = top + 1
        data[top] = value

    function pop():
        if top < 0:
            return -1          // stack is empty
        value = data[top]
        top = top - 1
        return value

    function peek():
        if top < 0:
            return null
        return data[top]

    function isEmpty():
        return top < 0

function processOperations(ops):
    s = new Stack()
    total = 0
    count = ops[0]
    idx = 1
    for i = 0 to count - 1:
        type = ops[idx]
        val  = ops[idx + 1]
        idx += 2
        if type == 1:
            s.push(val)
        else if type == 2:
            total += s.pop()
    return total
```

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Push      | O(1) | O(n)  |
| Pop       | O(1) | O(n)  |
| Peek      | O(1) | O(n)  |
| isEmpty   | O(1) | O(1)  |
| Search    | O(n) | O(1)  |

- **Push and Pop**: Both are O(1) because they only modify the top of the stack. For dynamic arrays, push is O(1) amortized (occasional resizing takes O(n), but this averages out to O(1) per operation).
- **Space**: O(n) where n is the number of elements currently on the stack.
- **Search**: Finding an arbitrary element requires popping elements one by one, which is O(n). Stacks are not designed for search operations.

### Array-based vs. Linked-list-based

| Aspect         | Array-based        | Linked-list-based    |
|----------------|--------------------|----------------------|
| Push/Pop time  | O(1) amortized     | O(1) worst-case      |
| Memory usage   | Contiguous, cache-friendly | Pointer overhead per node |
| Max size       | Fixed (or resizable) | Limited by memory    |
| Implementation | Simpler            | Slightly more complex |

## Applications

- **Function call management (call stack)**: Every function call pushes a frame onto the call stack; returning pops it. This is how recursion works at the hardware level.
- **Expression evaluation and parsing**: Evaluating postfix (Reverse Polish Notation) expressions uses a stack. Converting infix to postfix (Shunting Yard algorithm) also uses a stack for operators.
- **Undo/redo mechanisms**: Each user action is pushed onto an undo stack. Undoing pops from the undo stack and pushes onto the redo stack.
- **Backtracking algorithms (DFS)**: Depth-first search uses a stack (either explicitly or via recursion) to explore paths and backtrack when stuck.
- **Balanced parentheses checking**: Opening brackets are pushed; closing brackets trigger a pop and match check.
- **Browser history (back button)**: Visited pages are pushed onto a stack; pressing "back" pops the current page.
- **Syntax parsing and compilers**: Parsers use stacks for shift-reduce parsing and for managing nested constructs.

## When NOT to Use

- **When you need FIFO (first-in-first-out) ordering**: Use a queue. For example, BFS, print job scheduling, and message passing all require FIFO ordering, which a stack cannot provide.
- **When you need random access**: A stack only exposes the top element. If you need to access elements at arbitrary positions, use an array or deque.
- **When you need priority-based access**: If the next element to process should be the highest-priority one (not necessarily the most recent), use a priority queue.
- **When you need to search for elements**: Searching a stack requires O(n) time by popping elements. If frequent lookups are needed, use a hash set or balanced BST.
- **When you need concurrent FIFO processing**: For producer-consumer patterns, a concurrent queue is more appropriate than a stack.

## Comparison

| Data Structure   | Insert    | Remove    | Access Pattern | Order Guarantee |
|------------------|-----------|-----------|----------------|-----------------|
| Stack            | O(1) top  | O(1) top  | Top only       | LIFO            |
| Queue            | O(1) rear | O(1) front| Front only     | FIFO            |
| Deque            | O(1) both | O(1) both | Both ends      | Insertion order |
| Priority Queue   | O(log n)  | O(log n)  | Min/Max only   | Priority order  |
| Array            | O(1) end* | O(1) end* | Random O(1)    | Index order     |
| Linked List      | O(1)**    | O(1)**    | Sequential     | Insertion order |

\* Amortized for dynamic arrays.
\** With pointer to insertion/removal point.

**Stack vs. Queue**: Both are O(1) for insert and remove. The fundamental difference is ordering: LIFO (stack) vs. FIFO (queue). DFS uses a stack; BFS uses a queue. An iterative DFS can be converted to BFS simply by replacing the stack with a queue.

**Stack vs. Deque**: A deque supports O(1) operations at both ends. A stack is a restricted deque that only allows access at one end. Use a deque when you need both LIFO and FIFO behavior in the same data structure.

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.), Section 10.1: Stacks and queues.
- Sedgewick, R. & Wayne, K. (2011). *Algorithms* (4th ed.), Section 1.3: Bags, Queues, and Stacks.
- Knuth, D. E. (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.), Section 2.2.1: Stacks, Queues, and Deques.
- Dijkstra, E. W. (1961). "Algol 60 translation: An ALGOL 60 translator for the x1." *Annual Review in Automatic Programming*, 3, 329-356. (Early description of using a stack for expression evaluation.)

## Implementations

| Language   | File |
|------------|------|
| Python     | [stack_operations.py](python/stack_operations.py) |
| Java       | [StackOperations.java](java/StackOperations.java) |
| C++        | [stack_operations.cpp](cpp/stack_operations.cpp) |
| C          | [stack_operations.c](c/stack_operations.c) |
| Go         | [stack_operations.go](go/stack_operations.go) |
| TypeScript | [stackOperations.ts](typescript/stackOperations.ts) |
| Rust       | [stack_operations.rs](rust/stack_operations.rs) |
| Kotlin     | [StackOperations.kt](kotlin/StackOperations.kt) |
| Swift      | [StackOperations.swift](swift/StackOperations.swift) |
| Scala      | [StackOperations.scala](scala/StackOperations.scala) |
| C#         | [StackOperations.cs](csharp/StackOperations.cs) |
