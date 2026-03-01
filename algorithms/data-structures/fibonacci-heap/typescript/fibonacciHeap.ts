class FibNode {
    key: number;
    degree: number = 0;
    parent: FibNode | null = null;
    child: FibNode | null = null;
    left: FibNode = this;
    right: FibNode = this;
    mark: boolean = false;

    constructor(key: number) {
        this.key = key;
        this.left = this;
        this.right = this;
    }
}

class FibHeapImpl {
    minNode: FibNode | null = null;
    n: number = 0;

    insert(key: number): void {
        const node = new FibNode(key);
        if (this.minNode === null) {
            this.minNode = node;
        } else {
            this.addToRootList(node);
            if (node.key < this.minNode.key) this.minNode = node;
        }
        this.n++;
    }

    extractMin(): number {
        const z = this.minNode;
        if (z === null) return -1;
        if (z.child !== null) {
            const children = this.getSiblings(z.child);
            for (const c of children) {
                this.addToRootList(c);
                c.parent = null;
            }
        }
        this.removeFromList(z);
        if (z === z.right) {
            this.minNode = null;
        } else {
            this.minNode = z.right;
            this.consolidate();
        }
        this.n--;
        return z.key;
    }

    private addToRootList(node: FibNode): void {
        node.left = this.minNode!;
        node.right = this.minNode!.right;
        this.minNode!.right.left = node;
        this.minNode!.right = node;
    }

    private removeFromList(node: FibNode): void {
        node.left.right = node.right;
        node.right.left = node.left;
    }

    private getSiblings(node: FibNode): FibNode[] {
        const sibs: FibNode[] = [];
        let curr = node;
        do {
            sibs.push(curr);
            curr = curr.right;
        } while (curr !== node);
        return sibs;
    }

    private consolidate(): void {
        const maxDeg = Math.floor(Math.log2(this.n)) + 2;
        const A: (FibNode | null)[] = new Array(maxDeg + 1).fill(null);
        const roots = this.getSiblings(this.minNode!);
        for (const w of roots) {
            let x = w;
            let d = x.degree;
            while (d < A.length && A[d] !== null) {
                let y = A[d]!;
                if (x.key > y.key) { const t = x; x = y; y = t; }
                this.link(y, x);
                A[d] = null;
                d++;
            }
            while (d >= A.length) A.push(null);
            A[d] = x;
        }
        this.minNode = null;
        for (const node of A) {
            if (node !== null) {
                node.left = node;
                node.right = node;
                if (this.minNode === null) {
                    this.minNode = node;
                } else {
                    this.addToRootList(node);
                    if (node.key < this.minNode.key) this.minNode = node;
                }
            }
        }
    }

    private link(y: FibNode, x: FibNode): void {
        this.removeFromList(y);
        y.left = y;
        y.right = y;
        if (x.child === null) {
            x.child = y;
        } else {
            y.left = x.child;
            y.right = x.child.right;
            x.child.right.left = y;
            x.child.right = y;
        }
        y.parent = x;
        x.degree++;
        y.mark = false;
    }
}

export function fibonacciHeap(operations: number[]): number[] {
    const heap = new FibHeapImpl();
    const results: number[] = [];
    for (const op of operations) {
        if (op === 0) {
            results.push(heap.extractMin());
        } else {
            heap.insert(op);
        }
    }
    return results;
}

console.log(fibonacciHeap([3, 1, 4, 0, 0]));
console.log(fibonacciHeap([5, 2, 8, 1, 0, 0, 0, 0]));
