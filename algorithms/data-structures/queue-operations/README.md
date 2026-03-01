# Queue

## Overview

A Queue is a linear data structure that follows the First-In-First-Out (FIFO) principle. Elements are added (enqueued) at the rear and removed (dequeued) from the front, just like a line of people waiting -- the first person to arrive is the first person served.

Queues are one of the most fundamental data structures in computer science. They can be implemented using arrays, linked lists, or circular buffers. This implementation processes a sequence of enqueue and dequeue operations and returns the sum of all dequeued values.

## How It Works

1. **Enqueue**: Add an element to the rear of the queue. In an array-based implementation, this appends to the end of the array. In a linked-list implementation, a new node is added after the tail and the tail pointer is updated.
2. **Dequeue**: Remove and return the element at the front of the queue. The front pointer advances to the next element. If the queue is empty, the operation returns 0.
3. **Peek/Front**: Return the front element without removing it.
4. **isEmpty**: Check whether the queue has no elements.

Operations are encoded as a flat array: `[op_count, type, val, ...]` where type 1 = enqueue value, type 2 = dequeue (val ignored, returns 0 if empty). The function returns the sum of all dequeued values.

## Example

**Step-by-step trace** with input `[4, 1,5, 1,3, 2,0, 2,0]`:

```
Operation 1: ENQUEUE 5
  Queue (front -> rear): [5]

Operation 2: ENQUEUE 3
  Queue: [5, 3]

Operation 3: DEQUEUE
  Remove front element: 5
  Queue: [3]

Operation 4: DEQUEUE
  Remove front element: 3
  Queue: []

Sum of dequeued values = 5 + 3 = 8
```

**Another example** with input `[6, 1,10, 1,20, 1,30, 2,0, 2,0, 2,0]`:

```
ENQUEUE 10  -> Queue: [10]
ENQUEUE 20  -> Queue: [10, 20]
ENQUEUE 30  -> Queue: [10, 20, 30]
DEQUEUE     -> Returns 10, Queue: [20, 30]
DEQUEUE     -> Returns 20, Queue: [30]
DEQUEUE     -> Returns 30, Queue: []

Sum = 10 + 20 + 30 = 60
```

## Pseudocode

```
class Queue:
    front = 0
    data = []

    function enqueue(value):
        data.append(value)

    function dequeue():
        if front >= data.length:
            return 0              // queue is empty
        value = data[front]
        front = front + 1
        return value

    function isEmpty():
        return front >= data.length

    function peek():
        if isEmpty():
            return null
        return data[front]

function processOperations(ops):
    q = new Queue()
    total = 0
    count = ops[0]
    idx = 1
    for i = 0 to count - 1:
        type = ops[idx]
        val  = ops[idx + 1]
        idx += 2
        if type == 1:
            q.enqueue(val)
        else if type == 2:
            total += q.dequeue()
    return total
```

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Enqueue   | O(1) | O(n)  |
| Dequeue   | O(1) | O(n)  |
| Peek      | O(1) | O(n)  |
| isEmpty   | O(1) | O(1)  |

- **Enqueue**: Appending to the rear is O(1) amortized for dynamic arrays, or O(1) worst-case for linked lists and circular buffers.
- **Dequeue**: With a front pointer or linked-list head removal, dequeue is O(1). A naive array implementation that shifts all elements would be O(n), but using an index or linked list avoids this.
- **Space**: O(n) where n is the number of elements currently in the queue.

### Circular Buffer Optimization

A circular buffer (ring buffer) uses a fixed-size array with two pointers (front and rear) that wrap around. This avoids the wasted space from advancing the front pointer in a simple array and provides O(1) worst-case for both operations without dynamic allocation.

## Applications

- **Breadth-first search (BFS)**: Vertices are explored level by level using a queue.
- **Print job scheduling**: Documents are printed in the order they are submitted.
- **Task queues and message queues**: Systems like RabbitMQ and Celery use queues to distribute work among consumers.
- **CPU process scheduling**: Round-robin scheduling uses a queue of processes.
- **Buffering**: Data streams (keyboard input, network packets) use queues to buffer data between producer and consumer.
- **Level-order tree traversal**: Nodes of a tree are visited level by level using a queue.

## When NOT to Use

- **When you need LIFO (last-in-first-out) ordering**: Use a stack instead. For example, function call management, undo operations, and depth-first search all require LIFO behavior.
- **When you need priority-based access**: A regular queue processes elements strictly in arrival order. If higher-priority items should be served first regardless of when they arrived, use a priority queue.
- **When you need random access to elements**: Queues only expose the front element. If you need to access or modify elements at arbitrary positions, use an array or deque.
- **When you need to search for elements**: Searching a queue requires O(n) time. If frequent lookups are needed, use a hash set or balanced BST.

## Comparison

| Data Structure   | Insert    | Remove    | Access Pattern | Order Guarantee |
|------------------|-----------|-----------|----------------|-----------------|
| Queue            | O(1) rear | O(1) front| Front only     | FIFO            |
| Stack            | O(1) top  | O(1) top  | Top only       | LIFO            |
| Deque            | O(1) both | O(1) both | Both ends      | Insertion order |
| Priority Queue   | O(log n)  | O(log n)  | Min/Max only   | Priority order  |
| Linked List      | O(1)*     | O(1)*     | Sequential     | Insertion order |
| Circular Buffer  | O(1)      | O(1)      | Front only     | FIFO            |

\* With pointer to insertion/removal point.

**Queue vs. Stack**: Both are O(1) for insert and remove. The key difference is ordering -- FIFO vs. LIFO. BFS uses a queue; DFS uses a stack.

**Queue vs. Deque**: A deque (double-ended queue) supports O(1) insertion and removal at both ends. A queue is a restricted deque. Use a deque when you need both FIFO and LIFO behavior (e.g., work-stealing schedulers).

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.), Section 10.1: Stacks and queues.
- Sedgewick, R. & Wayne, K. (2011). *Algorithms* (4th ed.), Section 1.3: Bags, Queues, and Stacks.
- Knuth, D. E. (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.), Section 2.2.1: Stacks, Queues, and Deques.

## Implementations

| Language   | File |
|------------|------|
| Python     | [queue_operations.py](python/queue_operations.py) |
| Java       | [QueueOperations.java](java/QueueOperations.java) |
| C++        | [queue_operations.cpp](cpp/queue_operations.cpp) |
| C          | [queue_operations.c](c/queue_operations.c) |
| Go         | [queue_operations.go](go/queue_operations.go) |
| TypeScript | [queueOperations.ts](typescript/queueOperations.ts) |
| Rust       | [queue_operations.rs](rust/queue_operations.rs) |
| Kotlin     | [QueueOperations.kt](kotlin/QueueOperations.kt) |
| Swift      | [QueueOperations.swift](swift/QueueOperations.swift) |
| Scala      | [QueueOperations.scala](scala/QueueOperations.scala) |
| C#         | [QueueOperations.cs](csharp/QueueOperations.cs) |
