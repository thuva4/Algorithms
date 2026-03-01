class ListNode {
    value: number;
    next: ListNode | null = null;

    constructor(value: number) {
        this.value = value;
    }
}

function buildList(arr: number[]): ListNode | null {
    if (arr.length === 0) {
        return null;
    }
    const head = new ListNode(arr[0]);
    let current = head;
    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }
    return head;
}

function toArray(head: ListNode | null): number[] {
    const result: number[] = [];
    let current = head;
    while (current !== null) {
        result.push(current.value);
        current = current.next;
    }
    return result;
}

export function reverseLinkedList(arr: number[]): number[] {
    let head = buildList(arr);

    let prev: ListNode | null = null;
    let current = head;
    while (current !== null) {
        const next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }

    return toArray(prev);
}
