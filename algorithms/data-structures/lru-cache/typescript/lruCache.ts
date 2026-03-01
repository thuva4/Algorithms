class LruNode {
    key: number;
    value: number;
    prev: LruNode | null = null;
    next: LruNode | null = null;

    constructor(key: number, value: number) {
        this.key = key;
        this.value = value;
    }
}

class LruCacheImpl {
    private capacity: number;
    private map: Map<number, LruNode>;
    private head: LruNode;
    private tail: LruNode;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.map = new Map();
        this.head = new LruNode(0, 0);
        this.tail = new LruNode(0, 0);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    private remove(node: LruNode): void {
        node.prev!.next = node.next;
        node.next!.prev = node.prev;
    }

    private addToHead(node: LruNode): void {
        node.next = this.head.next;
        node.prev = this.head;
        this.head.next!.prev = node;
        this.head.next = node;
    }

    get(key: number): number {
        if (this.map.has(key)) {
            const node = this.map.get(key)!;
            this.remove(node);
            this.addToHead(node);
            return node.value;
        }
        return -1;
    }

    put(key: number, value: number): void {
        if (this.map.has(key)) {
            const node = this.map.get(key)!;
            node.value = value;
            this.remove(node);
            this.addToHead(node);
        } else {
            if (this.map.size === this.capacity) {
                const lru = this.tail.prev!;
                this.remove(lru);
                this.map.delete(lru.key);
            }
            const node = new LruNode(key, value);
            this.map.set(key, node);
            this.addToHead(node);
        }
    }
}

export function lruCache(operations: number[]): number {
    const capacity = operations[0];
    const opCount = operations[1];
    const cache = new LruCacheImpl(capacity);
    let resultSum = 0;
    let idx = 2;

    for (let i = 0; i < opCount; i++) {
        const opType = operations[idx];
        const key = operations[idx + 1];
        const value = operations[idx + 2];
        idx += 3;

        if (opType === 1) {
            cache.put(key, value);
        } else if (opType === 2) {
            resultSum += cache.get(key);
        }
    }

    return resultSum;
}
